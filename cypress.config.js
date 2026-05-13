import { defineConfig } from 'cypress';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import crypto from 'node:crypto';

dotenv.config({ path: '.env.test' });

const JWT_SECRET = process.env.JWT_SECRET;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY, // service role so it can bypass RLS
);

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', // your app's dev server
    allowCypressEnv: false,
    setupNodeEvents(on) {
      on('task', {
        makeAuthToken({ userId, role, contact }) {
          const encodeBase64Url = (value) =>
            Buffer.from(JSON.stringify(value)).toString('base64url');

          const header = { alg: 'HS256', typ: 'JWT' };
          const payload = {
            userId,
            role,
            contact,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 3,
          };

          const encodedHeader = encodeBase64Url(header);
          const encodedPayload = encodeBase64Url(payload);
          const signature = crypto
            .createHmac('sha256', JWT_SECRET)
            .update(`${encodedHeader}.${encodedPayload}`)
            .digest('base64url');

          return `${encodedHeader}.${encodedPayload}.${signature}`;
        },

        async resetDb() {
          const tablesToClear = [
            { table: 'ChatMessages', key: 'message_id' },
            { table: 'ChatSession', key: 'chat_id' },
            { table: 'RewardTransaction', key: 'trans_id' },
            { table: 'OrderItem', key: 'order_item_id' },
            { table: 'Order', key: 'order_id' },
            { table: 'RegistrationCode', key: 'code_id' },
            { table: 'Announcement', key: 'announce_id' },
            { table: 'Medication', key: 'medication_id' },
            { table: 'Reward', key: 'reward_id' },
            { table: 'Patient', key: 'patient_id' },
          ];

          for (const { table, key } of tablesToClear) {
            try {
              const { error } = await supabase
                .from(table)
                .delete()
                .not(key, 'is', null);

              if (error) {
                console.warn(
                  `Warning: Could not clear ${table}: ${error.message}`,
                );
              }
            } catch (err) {
              console.warn(`Error clearing ${table}:`, err);
            }
          }

          return null;
        },

        async seedOrders() {
          try {
            // 1. Get or Create eNavigator
            let { data: enav } = await supabase
              .from('eNavigator')
              .select('enav_id')
              .limit(1)
              .maybeSingle();

            if (!enav) {
              const dummyEnavId = '00000000-0000-0000-0000-000000000001';
              const { data: newEnav, error: enavErr } = await supabase
                .from('eNavigator')
                .upsert([{ enav_id: dummyEnavId, name: 'Cypress Test Enav' }], {
                  onConflict: 'enav_id',
                })
                .select()
                .single();

              if (enavErr && enavErr.code !== '42501') {
                // Only throw for non-permission errors
                throw enavErr;
              }
              enav = newEnav;
            }

            // 2. Get or Create Patient
            let { data: patient } = await supabase
              .from('Patient')
              .select('patient_id')
              .limit(1)
              .maybeSingle();

            if (!patient) {
              const dummyPatientId = '00000000-0000-0000-0000-000000000002';
              const { data: newPatient, error: pErr } = await supabase
                .from('Patient')
                .upsert(
                  [
                    {
                      patient_id: dummyPatientId,
                      firstname: 'Cypress',
                      surname: 'Patient',
                      contact: '09000000000',
                      sex: 'Female',
                      birthday: '1990-01-01',
                      pin_hash: 'dummy_hash',
                      address: 'Cypress Test Street',
                    },
                  ],
                  { onConflict: 'patient_id' },
                )
                .select()
                .single();

              if (pErr && pErr.code === '42501') {
                console.error(
                  '❌ PERMISSION DENIED: service_role cannot write to database.',
                );
                console.error(
                  '🔧 TO FIX: Run this SQL in your Supabase Dashboard SQL Editor:',
                );
                console.error('');
                console.error(
                  '  GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;',
                );
                console.error(
                  '  GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;',
                );
                console.error(
                  '  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;',
                );
                console.error(
                  '  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;',
                );
                console.error('');
                console.error(
                  '📚 See: https://supabase.com/docs/guides/database/postgres/role-based-access-control',
                );
                // Don't throw - let tests proceed and fail with clearer data-missing errors
                return null;
              } else if (pErr) {
                throw pErr;
              } else {
                patient = newPatient;
              }
            }

            if (!patient) {
              console.warn(
                '⚠️  No Patient available for seeding. Tests may fail due to missing data.',
              );
              return null;
            }

            // 3. Create mock orders
            const { data: orders, error: orderErr } = await supabase
              .from('Order')
              .insert([
                {
                  patient_id: patient.patient_id,
                  order_date: new Date().toISOString(),
                  delivery_type: 'delivery',
                  status: 'pending',
                  delivery_address: '123 Cypress St, Test City',
                },
                {
                  patient_id: patient.patient_id,
                  order_date: new Date(Date.now() - 86400000).toISOString(),
                  delivery_type: 'pickup',
                  status: 'preparing',
                  delivery_address: 'Pharmacy Counter 1',
                },
              ])
              .select();

            if (orderErr && orderErr.code === '42501') {
              console.error(
                '❌ PERMISSION DENIED: service_role cannot write orders.',
              );
              return null;
            } else if (orderErr) {
              throw orderErr;
            }
            return orders;
          } catch (err) {
            console.error('Seed error:', err);
            // Return null instead of throwing to allow tests to continue
            // and fail with more specific data-missing errors
            return null;
          }
        },
      });
    },
  },

  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
});

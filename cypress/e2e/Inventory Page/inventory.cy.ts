describe('Inventory e2e flow', () => {
  const adminTokenUser = {
    userId: 'cypress-admin-user',
    role: 'admin',
    contact: 'admin@test.com',
  };

  const testMedicine = {
    name: 'Cutie test Medicine',
    description: 'Cutie description',
    category: 'Hypertension',
    price: 12,
    stock: 15,
    lowStockThreshold: 10,
    dosage: 25,
  };

  before(() => {
    cy.task('resetDb');
  });

  beforeEach(() => {
    cy.task('makeAuthToken', adminTokenUser).then((token) => {
      cy.visit('/inventory', {
        onBeforeLoad(win) {
          win.localStorage.setItem('token', String(token));
          win.localStorage.setItem('isAuthenticated', 'true');
          win.localStorage.setItem(
            'user',
            JSON.stringify({ email: adminTokenUser.contact }),
          );
        },
      });
    });
  });

  it('adds, edits, and deletes a medicine', () => {
    cy.contains('h1', 'Inventory').should('be.visible');

    const stubMedicineResponse = {
      medication_id: 999,
      name: 'Cutie test Medicine',
      type: 'Hypertension',
      price: 12,
      stock_qty: 15,
      threshold_qty: 10,
      description: 'Cutie description',
      dosage: 25,
    };

    cy.intercept('GET', 'http://localhost:3000/medications*', {
      statusCode: 200,
      body: {
        success: true,
        data: [stubMedicineResponse],
        meta: { total: 1, page: 1, limit: 100, totalPages: 1 },
      },
    }).as('fetchMedications');

    cy.intercept('POST', 'http://localhost:3000/medications', {
      statusCode: 201,
      body: {
        success: true,
        message: 'Medication created successfully',
        data: stubMedicineResponse,
      },
    }).as('createMedication');

    cy.intercept('PUT', 'http://localhost:3000/medications/999', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Medication updated successfully',
        data: {
          ...stubMedicineResponse,
          name: `${testMedicine.name} Updated`,
          description: 'Updated cutie description',
          type: 'Diabetes',
          price: 20,
          stock_qty: 30,
          threshold_qty: 15,
          dosage: 50,
        },
      },
    }).as('updateMedication');

    cy.intercept('DELETE', 'http://localhost:3000/medications/999', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Medication deleted successfully',
        data: { medication_id: 999 },
      },
    }).as('deleteMedication');

    cy.get('[data-cy="add-medicine-button"]').first().click();

    cy.contains('Add New Medicine').should('be.visible');
    cy.get('[data-cy="medicine-name-input"]').type(testMedicine.name);
    cy.wait(800);
    cy.get('[data-cy="medicine-description-input"]').type(
      testMedicine.description,
    );
    cy.wait(800);
    cy.get('[data-cy="medicine-category-select"]').click();
    cy.wait(500);
    cy.get('[role="option"]').contains(testMedicine.category).click();
    cy.wait(500);
    cy.get('[data-cy="medicine-price-input"]')
      .clear()
      .type(String(testMedicine.price));
    cy.wait(500);
    cy.get('[data-cy="medicine-stock-input"]')
      .clear()
      .type(String(testMedicine.stock));
    cy.wait(500);
    cy.get('[data-cy="medicine-threshold-input"]')
      .clear()
      .type(String(testMedicine.lowStockThreshold));
    cy.wait(500);
    cy.get('[data-cy="medicine-dosage-input"]')
      .clear()
      .type(String(testMedicine.dosage));
    cy.wait(1000);
    cy.get('[data-cy="submit-add-medicine"]').click();
    cy.wait('@createMedication').its('response.statusCode').should('eq', 201);
    cy.wait('@fetchMedications');
    cy.contains(testMedicine.name).should('be.visible');
    cy.wait(1500);

    cy.contains('.rounded-xl.border.bg-white', testMedicine.name)
      .should('exist')
      .within(() => {
        cy.get('button[aria-label^="Edit "]').click();
      });

    cy.contains('Edit Medicine').should('be.visible');
    cy.get('[data-cy="medicine-name-input"]')
      .clear()
      .type(`${testMedicine.name} Updated`);
    cy.wait(800);
    cy.get('[data-cy="medicine-description-input"]')
      .clear()
      .type('Updated cutie description');
    cy.wait(800);
    cy.get('[data-cy="medicine-category-select"]').click();
    cy.wait(500);
    cy.get('[role="option"]').contains('Diabetes').click();
    cy.wait(500);
    cy.get('[data-cy="medicine-price-input"]').clear().type('20');
    cy.wait(500);
    cy.get('[data-cy="medicine-stock-input"]').clear().type('30');
    cy.wait(500);
    cy.get('[data-cy="medicine-threshold-input"]').clear().type('15');
    cy.wait(500);
    cy.get('[data-cy="medicine-dosage-input"]').clear().type('50');
    cy.wait(1000);

    // Update the GET intercept BEFORE submitting edit to return the updated medicine
    const updatedMedicine = {
      medication_id: 999,
      name: `${testMedicine.name} Updated`,
      type: 'Diabetes',
      price: 20,
      stock_qty: 30,
      threshold_qty: 15,
      description: 'Updated cutie description',
      dosage: 50,
    };

    cy.intercept('GET', 'http://localhost:3000/medications*', {
      statusCode: 200,
      body: {
        success: true,
        data: [updatedMedicine],
        meta: { total: 1, page: 1, limit: 100, totalPages: 1 },
      },
    }).as('fetchMedicationsUpdated');

    cy.get('[data-cy="submit-edit-medicine"]').click();
    cy.wait('@updateMedication').its('response.statusCode').should('eq', 200);
    cy.wait('@fetchMedicationsUpdated');

    // Close the dialog and verify the updated medicine is visible
    cy.get('[data-cy="medicine-name-input"]').should('not.exist'); // Dialog closed
    cy.contains(`${testMedicine.name} Updated`).should('be.visible');
    cy.contains('Diabetes').should('be.visible');
    cy.wait(1500);

    cy.contains('.rounded-xl.border.bg-white', `${testMedicine.name} Updated`)
      .should('exist')
      .within(() => {
        cy.get('button[aria-label^="Delete "]').click();
      });

    cy.contains('Delete Medicine').should('be.visible');
    cy.wait(1000);

    // Update the GET intercept BEFORE deleting to return empty list
    cy.intercept('GET', 'http://localhost:3000/medications*', {
      statusCode: 200,
      body: {
        success: true,
        data: [],
        meta: { total: 0, page: 1, limit: 100, totalPages: 1 },
      },
    }).as('fetchMedicationsDeleted');

    cy.contains('button', 'Delete').click();
    cy.wait(1000);
    cy.wait('@deleteMedication').its('response.statusCode').should('eq', 200);
    cy.wait('@fetchMedicationsDeleted');

    cy.contains(`${testMedicine.name} Updated`).should('not.exist');
  });
});

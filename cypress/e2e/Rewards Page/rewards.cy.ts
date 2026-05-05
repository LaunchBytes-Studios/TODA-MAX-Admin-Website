/// <reference types="cypress" />

import { getMockResponse, mockRewards } from './mockRewards';

describe('Rewards Page', () => {
  beforeEach(() => {
    // Intercept all GET requests to /rewards to mock the data
    cy.intercept('GET', '**/rewards*', (req) => {
      const accept = req.headers.accept || '';

      // Let the document navigation load the app HTML.
      if (accept.includes('text/html')) {
        req.continue();
        return;
      }

      // Mock the API response for XHR/fetch requests.
      req.reply({ statusCode: 200, body: getMockResponse(req.url) });
    }).as('getRewards');

    // Mock PUT for editing a reward
    cy.intercept('PUT', '**/rewards/*', {
      statusCode: 200,
      body: { success: true, data: { reward_id: 1 } },
    }).as('updateReward');

    // Mock POST for creating a reward
    cy.intercept('POST', '**/rewards', {
      statusCode: 201,
      body: { success: true, data: { reward_id: 999 } },
    }).as('createReward');

    // Mock DELETE for deleting a reward
    cy.intercept('DELETE', '**/rewards/*', {
      statusCode: 200,
      body: { success: true },
    }).as('deleteReward');

    cy.visit('http://localhost:5173/rewards', {
      onBeforeLoad: (win) => {
        const payload = { exp: Math.floor(Date.now() / 1000) + 3600 };
        const simulatedToken =
          'header.' + btoa(JSON.stringify(payload)) + '.signature';
        win.localStorage.setItem('token', simulatedToken);
        win.localStorage.setItem('isAuthenticated', 'true');
        win.localStorage.setItem(
          'user',
          JSON.stringify({ email: 'test@example.com' }),
        );
      },
    });

    // Wait for initial load
    cy.wait('@getRewards', { timeout: 10000 });
  });

  it('should display Rewards Catalog and stats', () => {
    // Verify page title
    cy.get('h1').should('contain', 'Rewards Catalog');

    // Verify at least one reward is rendered
    cy.contains(mockRewards[0].rewardName).should('be.visible');

    // Verify stats section exists
    cy.get('body').invoke('text').should('include', 'Total');
  });

  it('can add a reward via the UI', () => {
    // Open the add reward modal by clicking the button
    cy.contains('button', 'Add Reward').click();

    // Verify modal opens with "Add New Reward" title
    cy.get('h2').should('contain.text', 'Add New Reward');

    cy.get('input[placeholder="e.g P50 Medication Discount"]')
      .clear()
      .type('E2E Test Reward', { force: true });
    cy.get('textarea[placeholder*="Enter reward description"]')
      .clear()
      .type('Created by Cypress', { force: true });

    cy.get('input[type="number"]').eq(0).clear().type('25', { force: true });
    cy.get('input[type="number"]').eq(1).clear().type('8', { force: true });
    cy.get('input[type="number"]').eq(2).clear().type('5', { force: true });

    cy.get('[role="dialog"] form').then((form) => {
      (form[0] as HTMLFormElement).requestSubmit();
    });

    cy.wait('@createReward', { timeout: 10000 });
    cy.wait('@getRewards', { timeout: 10000 });
  });

  it('can delete a reward from the list', () => {
    // Verify reward is visible
    cy.contains(mockRewards[0].rewardName).should('be.visible');

    // Find the card by the reward name and get its delete button (the button with Trash icon)
    cy.contains(mockRewards[0].rewardName)
      .closest('[class*="border"]')
      .find('button')
      .last()
      .click();

    // Wait for delete modal to appear
    cy.get('h2').should('contain.text', 'Delete');

    // Click delete button in the modal
    cy.contains('button', 'Delete').click();

    // Verify delete request
    cy.wait('@deleteReward', { timeout: 10000 });

    // Verify list was refetched
    cy.wait('@getRewards', { timeout: 10000 });
  });

  it('can edit a reward from the list', () => {
    cy.contains(mockRewards[0].rewardName).should('be.visible');

    cy.contains(mockRewards[0].rewardName)
      .closest('[class*="border"]')
      .find('button')
      .first()
      .click();

    cy.get('h2').should('contain.text', 'Edit Reward');

    cy.get('input[placeholder*="P50 Medication"]')
      .clear()
      .type('Updated Reward Name', { force: true });
    cy.get('textarea[placeholder*="description"]')
      .clear()
      .type('Updated description', { force: true });
    cy.get('button[role="combobox"]').first().click({ force: true });
    cy.get('[role="option"]').first().click({ force: true });
    cy.get('input[type="number"]').eq(0).clear().type('75', { force: true });
    cy.get('input[type="number"]').eq(1).clear().type('15', { force: true });
    cy.get('input[type="number"]').eq(2).clear().type('3', { force: true });

    cy.contains('button', 'Save Changes').should('be.visible');
    cy.contains('button', 'Save Changes').click({ force: true });

    cy.wait('@updateReward', { timeout: 10000 });
    cy.wait('@getRewards', { timeout: 10000 });
  });

  it('can filter rewards by category', () => {
    cy.contains('button', 'Filter').click();

    cy.get('h2').should('contain.text', 'Filter Rewards');
    cy.contains('button', 'Discount').click();
    cy.contains('button', 'Apply').click();

    cy.contains(mockRewards[0].rewardName).should('be.visible');
    cy.contains(mockRewards[2].rewardName).should('be.visible');
    cy.contains(mockRewards[1].rewardName).should('not.exist');
    cy.contains(mockRewards[3].rewardName).should('not.exist');
  });

  it('can search and filter rewards', () => {
    // Initially, all rewards should be visible
    cy.contains(mockRewards[0].rewardName).should('be.visible');

    // Type in the search box - search for "P50" which only matches first reward
    cy.get('input[placeholder="Search rewards..."]').type('P50', {
      force: true,
    });

    // Wait for the search refetch
    cy.wait('@getRewards', { timeout: 10000 });

    // Verify the correct reward is shown
    cy.contains('P50 Medication Discount').should('be.visible');

    // Verify results are filtered by checking page content
    cy.get('body').invoke('text').should('include', 'P50 Medication Discount');

    // The Free Delivery reward should not be in the visible text (it's filtered)
    // This is a more reliable check than visibility since content may be clipped
    cy.contains(mockRewards[1].rewardName, { timeout: 2000 }).should(
      'not.exist',
    );
  });
});

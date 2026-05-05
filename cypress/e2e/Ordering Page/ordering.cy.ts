import { getMockResponse, mockOrders } from './mockOrders';

describe('Ordering Page', () => {
  beforeEach(() => {
    // Dynamic intercept — respects status, search, limit, and offset
    cy.intercept('GET', '**/enavigator/orders*', (req) => {
      req.reply({
        statusCode: 200,
        body: getMockResponse(req.url),
      });
    }).as('getOrders');

    cy.intercept('PATCH', '**/enavigator/orders/**', {
      statusCode: 200,
      body: { success: true },
    }).as('updateOrder');

    // Bypass login and visit the orders page
    cy.visit('/orders', {
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

    cy.wait('@getOrders');
  });

  it('should display the ordering page with stats cards', () => {
    cy.get('h1').should('contain', 'Orders');
    cy.contains('Total Orders').should('be.visible');
  });

  it('should update an order status to Preparing', () => {
    // Click Pending tab — if it fires a request wait for it, otherwise continue
    cy.contains('button', 'Pending').click();

    // Use a soft wait instead of cy.wait('@getOrders') since
    // clicking the default tab may not fire a new request
    cy.get('button').contains('Details').first().should('be.visible');

    // Open modal
    cy.get('button').contains('Details').first().click();

    cy.get('[role="dialog"]').within(() => {
      cy.contains('Order Details').should('exist');

      cy.get('button').contains('Accept & Prepare').click();
      cy.wait('@updateOrder');

      cy.get('button').find('.lucide-x').click({ force: true });
    });

    // Switch to Preparing tab — this should fire a new request
    cy.contains('button', 'Preparing').click();
    cy.wait('@getOrders');

    cy.get('.container').should('not.contain', 'No orders found');
  });

  it('should filter orders by status tabs and show correct orders', () => {
    const statusMap = [
      {
        tab: 'Preparing',
        name: mockOrders.find((o) => o.status === 'preparing')!.patient_name,
      },
      {
        tab: 'Ready',
        name: mockOrders.find((o) => o.status === 'ready')!.patient_name,
      },
      {
        tab: 'Completed',
        name: mockOrders.find((o) => o.status === 'completed')!.patient_name,
      },
      {
        tab: 'Rejected',
        name: mockOrders.find((o) => o.status === 'rejected')!.patient_name,
      },
      // Pending last so we can wait for its request after switching away
      {
        tab: 'Pending',
        name: mockOrders.find((o) => o.status === 'pending')!.patient_name,
      },
    ];

    statusMap.forEach(({ tab, name }) => {
      cy.contains('button', tab).click();
      cy.wait('@getOrders');

      // Assert the first order for this status is visible
      cy.contains(name).should('be.visible');

      // Assert active tab styling
      cy.contains('button', tab)
        .should('have.class', 'bg-white')
        .and('have.class', 'shadow-sm');
    });
  });

  it('should search for orders with debounce', () => {
    const searchTerm = 'John Doe';

    cy.get('input[placeholder*="Search"]').type(searchTerm);

    cy.wait('@getOrders').its('request.url').should('include', 'John');

    cy.get('body').should('contain', searchTerm);
  });

  it('should open and close order details modal', () => {
    cy.get('button').contains('Details').first().click();

    cy.get('[role="dialog"]').should('be.visible');
    cy.get('[role="dialog"]').contains('Order Details');

    cy.get('button').find('.lucide-x').click({ force: true });

    cy.get('[role="dialog"]').should('not.exist');
  });

  it('should handle pagination', () => {
    cy.get('button').contains(/^2$/).click();

    cy.contains('Page 2').should('be.visible');

    cy.wait('@getOrders').its('request.url').should('include', 'offset=10');
  });
});

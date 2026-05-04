beforeEach(() => {
  cy.task('resetDb');
});

it('loads the homepage', () => {
  cy.visit('/');
  cy.contains('Get'); // adjust to your app
});

describe('Navigate to Discord Chat Login', () => {
	beforeEach(() => {
		cy.visit('https://discord.com/login');
	});
	it('Displays Email and Password', () => {
		cy.url().should('include', '/login');
		cy
			.get('[aria-label="Email or Phone Number"]')
			.type('ed.guzikowski@ptml.com')
			.should('have.value', 'ed.guzikowski@ptml.com');
		cy.get('[aria-label="Password"]').type('Accelerat3').should('have.value', 'Accelerat3');
		cy.get('.marginBottom8-AtZOdT > .contents-18-Yxp').click();
		cy.get('[aria-label="  Accelerate Chat server"]').click();
	});
});
describe('Navigate to Slack Chat Login', () => {
	beforeEach(() => {
		cy.visit('https://ptml.slack.com/');
	});
	it('Displays Email and Password', () => {
		cy.url().should('include', 'ptml');
		cy.get('#email').type('ed.guzikowski@ptml.co.nz').should('have.value', 'ed.guzikowski@ptml.co.nz');
		cy.get('#password').type('Accelerat2').should('have.value', 'Accelerat2');
		cy.get('#signin_btn').click();
		cy.url().should('include', '/client/T025L1J8C/C025L1J8L');
	});
});

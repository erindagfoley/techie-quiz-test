describe('Quiz E2E Tests', () => {
  beforeEach(() => {
    // Mock the API call to get questions
    cy.intercept('GET', '/api/questions/random', {
      fixture: 'questions.json',
      delay: 1000,
    }).as('getQuestions');

    // Visit the page where the Quiz component is rendered
    cy.visit('/'); // Adjust the URL as needed
  });

  it('should start the quiz and display each question', () => {
    // Click the start button
    cy.get('.btn.btn-primary.d-inline-block.mx-auto').click();

    // Wait for the questions to be loaded
    cy.wait('@getQuestions');
    const NUMBER_OF_QUESTIONS = 2;
    for (let index = 0; index < NUMBER_OF_QUESTIONS; index++) {
      // Verify each question is displayed
      cy.get('h2').should('be.visible');

      // Verify the answers are displayed
      cy.get('button').first().should('be.visible').click();
    }

  });

  it('should handle correct and incorrect answers and show the final score', () => {
    // Click the start button
    cy.get('.btn.btn-primary.d-inline-block.mx-auto').click();

    // Wait for the questions to be loaded
    cy.wait('@getQuestions');
    const NUMBER_OF_QUESTIONS = 2;
    for (let index = 0; index < NUMBER_OF_QUESTIONS; index++) {
      // Verify each question is displayed
      cy.get('h2').should('be.visible');

      // Verify the answers are displayed
      cy.get('button').first().should('be.visible').click();
    }

    // Verify the quiz is completed and the score is displayed
    cy.contains('Quiz Completed').should('be.visible');
    cy.contains('Your score').should('be.visible');
  });

  it('should allow restarting the quiz', () => {
     // Click the start button
     cy.get('.btn.btn-primary.d-inline-block.mx-auto').click();

     // Wait for the questions to be loaded
     cy.wait('@getQuestions');
     const NUMBER_OF_QUESTIONS = 2;
     for (let index = 0; index < NUMBER_OF_QUESTIONS; index++) {
       // Verify each question is displayed
       cy.get('h2').should('be.visible');
 
       // Verify the answers are displayed
       cy.get('button').first().should('be.visible').click();
     }

    // Click the "Take New Quiz" button
    cy.contains('Take New Quiz').click();

    // Verify the quiz restarts
    cy.get('h2').should('be.visible');
  });
  
});
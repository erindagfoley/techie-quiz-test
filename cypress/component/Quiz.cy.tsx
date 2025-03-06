import Quiz from '../../client/src/components/Quiz'
import { mount } from 'cypress/react18';
import '@testing-library/cypress/add-commands';

describe('Quiz Component', () => {
  beforeEach(() => {
    // Mock the API call to get questions
    cy.intercept('GET', '/api/questions/start', {
      statusCode: 200,
      body: [
        {
          question: 'What is the output of print(2 ** 3)?',
          answers: [
            { "text": "6", "isCorrect": false },
            { "text": "8", "isCorrect": true },
            { "text": "9", "isCorrect": false },
            { "text": "12", "isCorrect": false },
          ],
        },
        {
          question: 'Which of the following is a mutable data type in Python?',
          answers: [
            { "text": "str", "isCorrect": false },
            { "text": "tuple", "isCorrect": false },
            { "text": "list", "isCorrect": true },
            { "text": "int", "isCorrect": false },
          ],
        },
      ],
    }).as('getQuestions');
  });

  it('should start the quiz and display the first question', () => {
    mount(<Quiz />);
    
    // Click the start button
    cy.get('[data-cy="start-button"]').click();

    // Wait for the questions to be loaded
    cy.wait('@getQuestions');

    // Verify the first question is displayed
    cy.contains('What is the output of print(2 ** 3)?').should('be.visible');

    // Verify the answers are displayed
    cy.contains('6').should('be.visible');
    cy.contains('8').should('be.visible');
    cy.contains('9').should('be.visible');
    cy.contains('12').should('be.visible');
  });

  it('should handle correct and incorrect answers', () => {
    mount(<Quiz />);
    
    // Start the quiz
    cy.get('[data-cy="start-button"]').click();
    cy.wait('@getQuestions');

    // Answer the first question correctly
    cy.contains('8').click();

    // Verify the second question is displayed
    cy.contains('Which of the following is a mutable data type in Python?').should('be.visible');

    // Answer the second question incorrectly
    cy.contains('str').click();

    // Verify the quiz is completed and the score is displayed
    cy.contains('Quiz Completed').should('be.visible');
    cy.contains('Your score: 1/2').should('be.visible');
  });

  it('should allow restarting the quiz', () => {
    mount(<Quiz />);
    
    // Start the quiz
    cy.get('[data-cy="start-button"]').click();
    cy.wait('@getQuestions');

    // Answer the first question correctly
    cy.contains('8').click();

    // Answer the second question incorrectly
    cy.contains('str').click();

    // Click the "Take New Quiz" button
    cy.contains('Take New Quiz').click();

    // Verify the quiz restarts
    cy.contains('What is the output of print(2 ** 3)?').should('be.visible');
  });

  it('should show loading spinner while fetching questions', () => {
    // Delay the response to simulate loading
    cy.intercept('GET', '/api/questions', {
      delay: 1000,
      statusCode: 200,
      body: [],
    }).as('getQuestions');

    mount(<Quiz />);
    
    // Click the start button
    cy.get('[data-cy="start-button"]').click();

    // Verify the loading spinner is displayed
    cy.get('.spinner-border').should('be.visible');

    // Wait for the questions to be loaded
    cy.wait('@getQuestions');

    // Verify the loading spinner is gone and questions are displayed
    cy.get('.spinner-border').should('not.exist');
    cy.contains('What is the output of print(2 ** 3)?').should('be.visible');
  });
});
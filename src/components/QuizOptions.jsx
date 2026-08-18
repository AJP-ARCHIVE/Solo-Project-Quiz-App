import React from "react"
import QuizQuestions from "./QuizQuestions"
export default function QuizOptions({ quizCategories, quizDifficultyLevel, formAction, handleStartGame, isQuestionsFetched }) {

    // Render Category Options
      const categoryOptionElement = quizCategories.map(category => <option key={category.id} id={category.id} value={category.id}>{category.name}</option>)

      //Render Difficulty options
      const difficultyOptionElement = quizDifficultyLevel.map(level => {
        // Capitalize Level 
        const levelUppercase =  level.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
        return <option key={level} id={`level-${level}`} value={level}>{levelUppercase}</option> 
    })

    return (
        <>
        {quizCategories &&
          <section className="options-section">
            <form className="quiz-options-form" action={formAction} aria-live="polite">
                <label htmlFor="category" className="option-label">Category: </label>
                <select id="category" name="category"  required>
                 
                    {categoryOptionElement}
                </select>

                <label htmlFor="difficulty" className="option-label">Difficulty Level: </label>
                <select id="difficulty" name="difficulty"  required>
              
                    {difficultyOptionElement}
                </select>

                <button type="submit" className="primary-btn" id="start-btn" onClick={handleStartGame} disabled={isQuestionsFetched}>Start quiz</button>
            </form> 
            
            </section> }
        </>
    )
}
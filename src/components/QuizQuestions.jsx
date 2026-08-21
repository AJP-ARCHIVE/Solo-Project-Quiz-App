import React from "react"
// Decode HTML Entities 
import {decode} from 'html-entities';


export default function QuizQuestions( { questionBank, isGameOver, handleSubmit, handleNewGame }) {



   const radioInputs = document.querySelectorAll('input[type="radio"]:checked')
   const checkedRadioInputs = Array.from(radioInputs)
   
   
   // Extract questions and answers from questionBank to compose new list of objects with the correct answer randomly inserted
   const [questionSet, setQuestionSet] = React.useState([])
   
   // Create an object with key and value pairs to record the corresponding question's selected answer 
   function createQuestionAnswerObj() {
     const object = {}
     for (let i=0; i < 5; i++) {
        object[`question-${i + 1}`] = null
     }
     return object
   }
   // Record selected answer for each question 
   const [selectedAnswers, setSelectedAnswers] = React.useState(() => createQuestionAnswerObj())
   const [totalAnswerCorrect, setTotalAnswerCorrect] = React.useState(0)
   
   // Indicate whether question was answered correctly or incorrectly - this is for when game is over
   const questionStatus = questionSet.map((question, index) => {
      return question.isSelectedAnswerCorrect ? `Question ${index + 1} is correct.` : `Question ${index + 1} is incorrect.`
   }).join(" ")
   //console.log("stat", questionStatus)

    React.useEffect(() => {
           // When questions page loads:
           // Apply class 'questions-page' to body 
           // Apply class 'quiz-section' to section 
           document.body.className = "questions-page"
           document.querySelector("section").className = "quiz-section"
           // Clean up function => Clear body/section class name
           return () => {
            document.body.className = ""
            document.querySelector("section").className = ""
           }
    }, [isGameOver])
   

   React.useEffect(() => {
        console.log("selected", selectedAnswers)
   }, [selectedAnswers])

   
   React.useEffect(() => {
    console.log("question set", questionSet)
   }, [questionSet])

   React.useEffect(() => {
       // Create a question and answer set based on questionBank prop
       setQuestionSet(questionBank.map((question, index) => {
             // Decode html entities in correct answer 
            const decodedCorrectAnswer = decode(question.correct_answer, {level: 'html5'})
            // Create new array of incorrect answers via copy -> goal is to not modify the original array. Decode html entities in array. 
            // Decode html entities in array of incorrect answers
            const decodedIncorrectAnswers = question.incorrect_answers.map(answer => decode(answer, {level: 'html5'}))
            // Use array of decoded incorrect answers to randomly insert the decoded correct answer
            const decodedAnswers = decodedIncorrectAnswers.map(answer => decode(answer, {level: 'html5'}))

            // Get random index
            // 4 Possible answer choices "indexes" 
            const randomIndex = Math.floor(Math.random() * (decodedAnswers.length + 1))
            //console.log(randomIndex)
            // Insert the correct answer into new array at the random index
            decodedAnswers.splice(randomIndex, 0, decodedCorrectAnswer)
            console.log("decoded all answers", decodedAnswers)
           
           
            return (
                {
                    number: index + 1,
                    question: decode(question.question), // Decode html entities in question 
                    correct_answer: decodedCorrectAnswer,
                    incorrect_answers: decodedIncorrectAnswers, // Decode html entities in incorrect answers 
                    answers: decodedAnswers,
                    isAnswered: false,
                    isSelectedAnswerCorrect: false
                }
            )
       }))
   }, [questionBank])
  
React.useEffect(() => {
    // Convert selectedAnswers object into array to iterate and check if selectedAnswer is correct
    // Compare selected answer with questionSet to compare selected answer against correct_answer in questionSet
    if (checkedRadioInputs.length === 5) {
    const quizOutput = Object.entries(selectedAnswers) 

    
    for (const [index, [question, answer]] of quizOutput.entries()) {
        // console.log("index", index)
        // console.log("question", question)
        // console.log("answer", answer)
        if(answer === questionSet[index].correct_answer) {
          
          setQuestionSet(prev => prev.map((questionItem, questionIndex) => {
            return questionIndex === index ? {...questionItem, isAnswered: true, isSelectedAnswerCorrect: true} : questionItem
          }))
       }
       else {
            setQuestionSet(prev => prev.map((questionItem, questionIndex) => {
            return questionIndex === index ? {...questionItem, isAnswered: true} : questionItem
          }))
       }
    }
    }
    
   }, [selectedAnswers])

   // Keep track of user answers - correct versus incorrect 
   // Calculate the total number of correct answers 
   React.useEffect(() => {
        // Look through each question and extract the isSelectedAnswerCorrect property then filter out only the correct ones 'true'
        // Get the length of the new array to calculate total correct 
        const numberCorrect = questionSet.map(question => question.isSelectedAnswerCorrect).filter(answer => answer).length
        console.log("number correct", numberCorrect)
        setTotalAnswerCorrect(numberCorrect)
   }, [questionSet])

  

   

  // Keep record of selected answer choice for each question "onChange event handler"
   function handleSelection(e) {
        //console.log("Changed:", e.target.name, e.target.value);
        setSelectedAnswers(prev => ({...prev, [e.target.name]: e.target.value}))

   }


   // Render questions and answer choices from questionSet derived from questionBank
    const questionSetElement = questionSet.map((set, questionIndex) => {
 
    const radios = set.answers.map((answer, index) => {
        // Conditional class render based on game over status and whether the selected answer  is correct when game is over
        // Compare each answer choice and check if it is the correct answer and if it was selected
        // If selected answer option is not correct then display the correct answer choice 
        const quizAnswerClass = isGameOver && selectedAnswers[`question-${questionIndex + 1}`] === answer && answer === set.correct_answer ? "correct-answer" : isGameOver && selectedAnswers[`question-${questionIndex + 1}`] === answer ? "incorrect-answer" : isGameOver && answer === set.correct_answer ? "show-correct-answer" : isGameOver && !Object.values(selectedAnswers).includes(answer) ? "not-selected-answer" : ""

        
    
        return (
                <label key={answer} className="answer-label">
                    <input type="radio" name={`question-${questionIndex + 1}`} value={answer} className="answer-input" onChange={handleSelection}  />
                    <span className={`${quizAnswerClass} answer-choice`}>{answer}</span>
                </label>
        )
    })
    return (
        <div key={set.question} className="questions-answers-container">
            {/* Group question using fieldset for screen readers to report answer choices/checked answer */}
            <fieldset className="question-group">
            <p className="quiz-question">{set.question}</p>
          
           <div className="answers-container">
            {radios}
            </div>
           <hr />
           </fieldset>
        </div>
    )
   })


    return (
        <>
        {/* Load question section only if questionBank has been fully loaded and updated to questionSet */}
        {questionSet.length >= 5 &&
          <section>
            <form action={isGameOver ? handleNewGame : handleSubmit} className="question-form" aria-live="polite">
                <div class="quiz-body">
                {questionSetElement}
                </div>
                <div className="score-container">
                {/* For screen readers - indicate whether question was answered correctly or incorrectly when game is over */}
                {isGameOver && (
                    <div aria-live="polite" role="status" className="sr-only">
                        {questionStatus}
                    </div>
                )}
                {/* Only display score when game is over */}
                { isGameOver && <p className="score-message" aria-live="polite">You scored {totalAnswerCorrect}/{questionBank.length} correct answers</p> }
                {/* Disable button if game is not over and not all questions are answered */}
                <button className="primary-btn" id="check-answers-btn"  disabled={!isGameOver && checkedRadioInputs.length !== 5}>{isGameOver ? "Play again" : "Check answers"}</button>
                </div>
            </form>
          </section> }
        </>
    )
}
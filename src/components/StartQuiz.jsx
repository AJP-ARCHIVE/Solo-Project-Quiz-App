"use client"
import React from "react"
import { getOptions } from "../actions"
import QuizOptions from "./QuizOptions"
import QuizQuestions from "./QuizQuestions"


export default function StartQuiz() {
      // Open Trivia API: https://opentdb.com/api_config.php 
      // Quiz difficulty 
      const quizDifficultyLevel = ["any difficulty", "easy", "medium", "hard"] // Default is "Any Difficulty"
    
      // Quiz Categories 
      const [quizCategories, setQuizCategories] = React.useState([])
      // Quiz question bank
      const [questionBank, setQuestionBank] = React.useState([])
      // Get selected quiz options upon quiz options form submission
      const [quizOptions, formAction, isPending] = React.useActionState(getOptions, 
        {category: null, difficulty: null})
      // Manage error/loading states for api fetches 
      const [categoryError, setCategoryError] = React.useState(null)
      const [triviaError, setTriviaError] = React.useState(null)
      const [loading, setLoading] = React.useState(true) // loading state for trivia api fetch
      // Keep track of whether game is over
      const [isGameOver, setIsGameOver] = React.useState(false)
      // Keep track of whether questions were fetched from API to prevent duplicate requests
      const [isQuestionsFetched, setIsQuestionsFetched] = React.useState(false)
      const [isNewGame, setIsNewGame] = React.useState(true)
      // Option display state
      //const [showOptions, setShowOptions] = React.useState(true)
      // Questions display state
      //const [showQuestions, setShowQuestions] = React.useState(false)
      
      //const questionFetchStatus = React.useRef(false)



      React.useEffect(() => {
        // When questions page loads:
        // Apply class 'start-page' to body 
        // Apply class 'quiz-section' to section 
        document.body.className = "start-page"
        document.querySelector("section").className = "quiz-section"
        // Clean up function => Clear body/section class name
        return () => {
          document.body.className = ""
          document.querySelector("section").className = ""
        }
      }, [isQuestionsFetched]) // Run again when a new set of questions is fetched "Game restart"

      // Fetch Quiz Category Options
      React.useEffect(() => {
        async function getCategories() {
          try {
               const response = await fetch("https://opentdb.com/api_category.php")
               const data = await response.json()
               //console.log(data.trivia_categories)
               const allCategories = data.trivia_categories
               // Add 'Any Categories' as a category option with the id of 0 since the API returns a object with an id and name. Starting id is 9 in API.
              allCategories.unshift({id: 0, name: "Any Category"}) // Default 
              setQuizCategories(allCategories) 
          }
          catch (error) {
            setCategoryError(error)
            console.error(error)
          }
         
          
        }
        getCategories()
      }, [])

      // Show options and questions when game is reset
      React.useEffect(() => {
         //setShowOptions(prev => !prev)
         //questionFetchStatus.current = false
         // if fetched questions exist -> display questions 
        //  if(questionBank) {
        //   //setShowQuestions(prev => !prev)
        //   setIsQuestionsFetched(prev => !prev) // false 
        //  }
        // If it is new game set fetched game status to false "game reset"
        if (isNewGame) {
           setIsQuestionsFetched(prev => !prev) // false
        }
        
        return 
        
     }, [isGameOver])

      // React.useEffect(() => {
      //   console.log("game status", isGameOver)
       
      // }, [isGameOver])


    
      //Fetch Quiz Questions
      React.useEffect(() => {
        async function getQuestions() {
          try {
              //console.log(quizOptions)
              if (!quizOptions?.category && !quizOptions?.difficulty) return
              //questionFetchStatus.current = true 
              
              // Reset game over status to false if previous game over status is true in order to start new game
              //setIsGameOver(prevGameStatus => prevGameStatus ? !prevGameStatus : prevGameStatus)
         
              //setShowQuestions(prevShowQuestions => isGameOver && prevShowQuestions ? !prevShowQuestions : prevShowQuestions)
              
              // Compose fetch url based on whether a non default value was selected for category and difficulty level
              const category = quizOptions.category !== "0" ? `&category=${quizOptions.category}` : ""
              const difficulty = quizOptions.difficulty !== "any difficulty" ? `&difficulty=${quizOptions.difficulty}` : ""
              
              const response = await fetch(`https://opentdb.com/api.php?amount=5${category}${difficulty}&type=multiple`)
              if(!response.ok) {
                throw new Error(`Error. Response Status: ${response.status}`)
              }
              const data = await response.json()
              // Response code of 0 = Success Returned results successfully. 
              if (data.response_code !== 0) {
                throw new Error("Something went wrong when fetching questions. Please refresh page and retry.")
              }
              //console.log(data.results)
              setIsQuestionsFetched(true)
              //setShowOptions(!showOptions)
              setQuestionBank(data.results)
             
          }
          catch(error) {
            setTriviaError(error)
            console.error(error)
          }
          finally {
            setLoading(false)
          }
        }
        getQuestions()
      }, [quizOptions])

      // async function getOptions(previousState, formData) {

      //   const category = formData.get("category")
      //   //console.log(category)
      //   const difficulty = formData.get("difficulty")
      //   return {category, difficulty}
      // }
    
    // Function for starting game 
    function handleStartGame() {
        // if (isQuestionsFetched) {
        //   setShowQuestions(prev => !prev)
        // } 
        // show game questions -> redirect to QuizQuestions Page
        //setShowStart(prev => !prev) // false
       //setShowQuestions(prev => !prev) // true 
      // setIsNewGame(true)
      setIsNewGame(false) // Set new game to false 
      //console.log("start")
      window.scrollTo({
      top: 0,
      behavior: 'auto' 
    });
    }

    // Resetting the game 
    function handleNewGame(e) {
        console.log("new game")
        setIsGameOver(!isGameOver) // false
        
        setIsNewGame(!isNewGame) // true 
        //setShowOptions(true)
        //setShowQuestions(false)
        window.scrollTo({
        top: 0,
        behavior: 'auto' 
      });
   }
   
   // Quiz submission 
    function handleSubmit(e) {
      // Set Game Over status to true 
     // End of Game "quiz submission"
        console.log("end game")
        setIsGameOver(prev => !prev) // Set game over status to true 
          
        
    }

    
    if (loading) {
      return (
        <section className="loading-error-section"><h2>{error}</h2></section>
      )
    }

    if (triviaError) {
      return (
        <section className="loading-error-section"><h2>{triviaError}</h2></section>
      )
    }

    
    return (
    
      
         <section className="main-section">
               {/* Show main quiz page only when questions have not been fetched  */}
               {!isQuestionsFetched && <article className="title-description">
                    <h1 className="title">Quizzical</h1>
                    <p className="description">Let's put your brain to the challenge!</p>
                </article> }
            {/* Show options when questions have not been fetched */}
         {!isQuestionsFetched && quizCategories && <QuizOptions quizCategories={quizCategories} quizDifficultyLevel={quizDifficultyLevel} formAction={formAction} handleStartGame={handleStartGame} isQuestionsFetched={isQuestionsFetched} /> }
               { isQuestionsFetched && <QuizQuestions questionBank={questionBank} isGameOver={isGameOver} setIsGameOver={setIsGameOver} isNewGame = {isNewGame} setIsNewGame={setIsNewGame}  handleSubmit={handleSubmit}  handleNewGame={handleNewGame} /> }
            

         </section> 
   
     
    )
}
" use server"
export async function getOptions(previousState, formData) {  
    const category = formData.get("category")
    //console.log(category)
    const difficulty = formData.get("difficulty")
    return {category, difficulty}
    }
export const getAllQuiz = async ()=>{
    try {
        // call api lấy danh sách quiz
        const res = await fetch('http://localhost:3000/quizs'); // call api:bất đồng bộ
        const data = await res.json()
        // console.log(data); // đồng bộ
        return data;
    } catch (error) {
        alert("Lỗi")
    }
}
export const  getQuestionByIdQuiz = async(idQuiz)=>{
    try {
        const res = await fetch(`http://localhost:3000/questions?quizId=${idQuiz}`)
        const data = await res.json()
        return data
    } catch (error) {
        alert(error)
    }

}

export const getQuizById = async (id) =>{
    try {
        // trả về 1 object chứa id theo điều kiện
        const res = await fetch(`http://localhost:3000/quizs/${id}`)
        const data = await res.json();
        return data
    } catch (error) {
        alert(error)
    }
}
export const addQuiz = async (data)=>{
    try {
        const res = await fetch('http://localhost:3000/quizs',{
            method: 'post', // phương thức thêm mới 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })    // res là res trả về nếu thêm thành công
        const dataRes = await res.json()
        return dataRes;
    } catch (error) {
        alert(error)
    }
    
}
export const addQuestions =async(datas)=>{
    try {
        datas.forEach(async(item)=>{
            await fetch('http://localhost:3000/questions',{
                method: "post", // phương thức thêm mới
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item) // chuyển dữ liệu từ object -> JSON
            }) // res là res trả về nếu thêm thành công
            console.log();
        })

        
    } catch (error) {
        alert("Thêm lỗi")
    }


}
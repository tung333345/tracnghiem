import{addQuiz} from "../services/api.js";
const app ={
    handleAdd : function () {
        // bắt sự kiện submit
        const form = document.getElementById('addForm').addEventListener('submit', async (e)=>{
            // ngăn chặn hành vi load trang 
            e.preventDefault();
            // lấy input 
            const inputTitle = document.getElementById('title');
            const inputisActive = document.getElementById('isActive');
            const inputTime = document.getElementById('time');
            const inputDescription = document.getElementById('description');
            // 3.validate 
            if(!inputTitle.value.trim()){
                alert("cần nhập thông tin tên quiz ");
                inputTitle.focus();
                return;       // ngăn chặn thực thi các tác vụ tiếp theo 

            }
            if(!inputTime.value.trim()){
                alert("cần nhập thông tin thời gian  ");
                inputTime.focus();
                return;       // ngăn chặn thực thi các tác vụ tiếp theo 

            }
            // 4.lấy dữ liệu
            const data ={
                title : inputTitle.value,
                isActive : inputisActive.checked,
                time : inputTime.value,
                description : inputDescription.value || ""
            }
            // thêm dữ liệu db
            // console.log(data);
            const res = await addQuiz(data);
            window.location = `addQuestion.html?id=${res.id}`
            alert("Thêm thành công");
            console.log(res);
        });
    }, 
    start : function (){
        this.handleAdd();
}

}
app.start();
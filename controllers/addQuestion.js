import {addQuestions} from "../services/api.js";
const app = {
    renderQuestion: function () {
        // láy độ dài của mảng
        const currentQuestion = document.querySelectorAll('.question_item').length + 1 || 1;
        // 2. thêm dữ liệu câu hỏi
        const listQuestion = document.getElementById('list_question');

        const divElenment = document.createElement('div');
        divElenment.classList = `question_item border border-2 rounded p-4 mb-2"`;
        divElenment.innerHTML = `
        <h4 class="question_number"> Câu hỏi ${currentQuestion} :</h4>
        <div class="mb-3">
            <label for="question_${currentQuestion}" class="form-label">Nội dung câu hỏi</label>
            <textarea class="form-control" id="question_content_${currentQuestion}" rows="3"></textarea>
        </div>
        <div class="answer_items mt-3">
            <div class="form-check fs-5 mb-3" >
                <!-- radio -->
                <input class="form-check-input border border-primary" role="button" type="radio" name="question_${currentQuestion}" id="check_${currentQuestion}_1" >
                <div class="mb-3">
                    <!-- text answer -->
                    <input type="text" class="form-control" id="answer_${currentQuestion}_2" placeholder="Nội dung đáp án 1">
                  </div>
            </div>

            <div class="form-check fs-5 mb-3">
                <input class="form-check-input border border-primary" role="button" type="radio" name="question_${currentQuestion}" id="check_${currentQuestion}_2" >
                <div class="mb-3">
                    <!-- text answer -->
                    <input type="text" class="form-control" id="answer_${currentQuestion}_3" placeholder="Nội dung đáp án 2">
                  </div>
            </div>

            <div class="form-check fs-5 mb-3">
                <input class="form-check-input border border-primary" role="button" type="radio" name="question_${currentQuestion}" id="check_${currentQuestion}_3">
                <div class="mb-3">
                    <!-- text answer -->
                    <input type="text" class="form-control" id="answer_${currentQuestion}_4" placeholder="Nội dung đáp án 3">
                  </div>
            </div>

            <div class="form-check fs-5 mb-3">
                <input class="form-check-input border border-primary" role="button" type="radio" name="question_${currentQuestion}" id="check_${currentQuestion}_4">
                <div class="mb-3">
                    <!-- text answer -->
                    <input type="text" class="form-control" id="answer_${currentQuestion}_1" placeholder="Nội dung đáp án 4">
                  </div>
            </div>
            

        </div>
        `

        listQuestion.appendChild(divElenment)
        const contentQuestion = document.getElementById(`question_content_${currentQuestion}`);
        contentQuestion?.focus();
        contentQuestion?.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    },
    handleAdd: function () {
        document.getElementById('btn_add').addEventListener('click', () => {
            this.renderQuestion();
        })
    },
    handleSubmit: function () {
        document.getElementById('btn_submit').addEventListener('click', async () => {
            //   1.lấy ra các câu hỏi và câu trả lời theo nhóm
            const listData = document.querySelectorAll('.question_item');
            // 1.2 lấy id của quiz trên url
            const searchParam = new URLSearchParams(window.location.search);
            // console.log(searchParam);
            let idQuiz;
            if (searchParam.has("id")) {
                idQuiz = searchParam.get("id");
            }
            // console.log(idQuiz);
            const data = [];

            

            for (var i = 0; i < listData.length; i++) {
                // 2. lấy ra nội dung câu hỏi 
                const questionContent = document.getElementById(`question_content_${i + 1}`)
                // console.log(questionContent);
                // 2.1 .lấy radio
                const checks = listData[i].querySelectorAll('input[type="radio"]');

                // console.log(check);
                // 2.3 lấy nội dung đáp án 
                const answerlist = listData[i].querySelectorAll('input[type ="text"]');
                // console.log(answerlist);
                // 2.4 validate
                const isCheck = this.validate(questionContent, checks, answerlist);
                // console.log(isCheck);
                if (!isCheck) {
                    break;
                }
                const item = {
                    questionTiltle: questionContent.value,
                    answers: [],
                    quizId: idQuiz,
                    type: 1,
                    correctAnser: []
                }
                answerlist.forEach((ans, index) => {
                    item.answers.push({
                        id: (index + 1).toString(),
                        answerTitle: ans.value,
                    });
                })
                checks.forEach((check, index) => {
                    if (check.checked) {
                        item.correctAnser.push((index + 1).toString())
                    }
                })
                //    console.log(item);
                   
                //    console.log(data);
                
                 
            }
            if(data.length == listData.length){
                await addQuestions(data)
                window.location='listQuiz.html';
                 alert("thêm thành công ")
                
          }
        })
    },
    validate: function (questionContent, checks, answerlist) {
        // 1. validate nội dung cau hỏi
        if (!questionContent.value.trim()) {
            alert("vui long nhap noi dung cau hoi");
            questionContent.focus();
            return false;
        }
        // 2. validate đáp án
        var isCheckRadio = false;
        for (var i = 0; i < checks.length; i++) {
            // nếu có ít nhất 1 radio đc lựa chọn
            if (checks[i].checked) {
                // đối tượng trạng thái 
                isCheckRadio = true;
                break;
            }

        }
        if (!isCheckRadio) {
            alert('cần lựa chọn đáp án đúng ')
            checks[0].focus();
            return false
        }
        // validate đáp án
        var isCheckAnswer = true
        for (var i = 0; i < answerlist.length; i++) {

            if (!answerlist[i].value.trim()) {
                alert("cần nhập nội dung đáp án");
                answerlist[i].focus();
                isCheckAnswer = false;
                break;
            }
        }
        if (!isCheckAnswer) {
            return false
        }
        return true
    },

    start: function () {
        this.renderQuestion();
        this.handleAdd();
        this.handleSubmit();
    }
}
app.start();
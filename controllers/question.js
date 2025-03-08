
import { getQuizById, getQuestionByIdQuiz } from "../services/api.js";
var listQuestion = [];
var listAnswerSubmit = [];
const btnSubmit = document.getElementById('btn_submit');
var  isSubmit =false;
const app = {
    getQuizandQuestion: async function () {
        const searchParam = new URLSearchParams(window.location.search);
        // console.log(searchParam);
        if (searchParam.has('id')) {
            const id = searchParam.get('id');
            // console.log(id);
            // phần 1 : lấy dữ liệu theo thông tin quiz
            const dataQuiz = await getQuizById(id);
            // console.log(dataQuiz);
            // 2.1 đếm ngược thời gian
            this.countDown(dataQuiz.time);



            // hien thi dữ liệu
            this.renderQuizinfo(dataQuiz);

            // ===============================================================================
            //  phần 2 : thông tin question
            listQuestion = await getQuestionByIdQuiz(id)
            this.renderListQuestion(listQuestion);
        }

    },
    renderQuizinfo: function (dataQuiz) {
        document.getElementById('quiz_heading').innerHTML = dataQuiz.title;
        document.getElementById('quiz_description').innerHTML = dataQuiz.description;
    },
    renderListQuestion: function (list) {
        // tráo câu hỏi
        // console.log(list);
        list = this.random(list);
        // console.log(list);
        const questionItem = list?.map((item, index) => {

            const listAnswer = this.renderAnswer(item.answers, item.type, item.id);
            return `        
                <div class="question_item border border-2 rounded p-4 mb-2">
            <h4 class="question_number"  id=${item.id} >Câu hỏi: ${index + 1}</h4>
            <h5 class="question_title" >
                ${item.questionTiltle}
            </h5>
            <div class="answer_items mt-3">
                ${listAnswer}
                

            </div>
        </div>
        `


        }).join("");
        document.getElementById('question_container').innerHTML = questionItem;

        // console.log(list);
        // console.log(listAnswer);
        // console.log(listAnswer);


    },
    renderAnswer: function (listAnswer, type, idQuestion) {
        //listAnswers: danh sách câu trả lời
        // type: kiểu câu hỏi 1: radio, 2: checkbox
        //idQuestion: id của câu hỏi

        // 1. tráo câu trả lời
        listAnswer = this.random(listAnswer);
        // console.log(listAnswer);
        // 2. duyệt qua mảng câu trả lời
        return listAnswer?.map((ans, index) => {
            //  thay đổi nội dung câu hỏi 
            return `
            
          <div class="form-check fs-5 mb-3" >
          <input class="form-check-input border border-2 border-primary" role="button" type="${type == 1 ? 'radio' : 'checkbox'}" name="question_${idQuestion}" id="answer_${idQuestion}_${ans.id}" data-idquestion="${idQuestion}" data-idAnswer="${ans.id}" >
          <label class="form-check-label" role="button" for="answer_${idQuestion}_${ans.id}"  >
              ${ans.answerTitle}
          </label>
      </div>
      `
        }).join("")
    },
    random: function (array) {
        return array.sort(() => {
            return Math.random() - Math.random();
        })
    },
    handleSubmit: function () {
      
        btnSubmit.addEventListener('click', () => {
            if (confirm("Bạn có muốn nộp bài?")) {
                isSubmit = true;
                this.handleSubmitForm();
            }
        })
    },
    handleSubmitForm: function () {
        // 0.disable nút input
        const inputAll = document.querySelectorAll('input');
        inputAll.forEach((item) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
               item.style.opacity = '0.5';
               item.style.filter = 'blur(2px)';
               item.disabled = true;

            }) 
        })
        // 1/lấy đáp án mà người lựa chọn
        // lấy tất cả câu trả lời theo từng câu hỏi
        const listAnswerUser = document.querySelectorAll('.answer_items');
        // console.log(listAnswerUser);
        // 2. lặp qua từng nhóm câu trả lời trong mảng
        listAnswerUser?.forEach((answers) => {
            // console.log(answer);
            const data = {
                idQuestion: '',
                idAnswers: [],

            }
            const inputs = answers.querySelectorAll('input');
            //  duyệt mảng cách câu trả lời 
            inputs?.forEach((ans) => {
                if (ans.checked) {
                    // console.log(ans);
                    data.idQuestion = ans.dataset.idquestion;
                    data.idAnswers.push(ans.dataset.idanswer);
                }
            })
            if (data.idAnswers && data.idAnswers.length) {
                listAnswerSubmit.push(data);
            }
        })
        // console.log(listAnswerSubmit);
        // kiểm tra đáp án xem đúng hay không 
        this.checkAnswer(listAnswerSubmit);
    },
    checkAnswer: function (listAnswerSubmit) {
        // 1. lưu trữ kết quả kiểm tra 
        const checkResult = [];
        // 2. duyệt qua các đáp án mà người dùng lựa chọn 
        const listStatus = [];
        let countRight = 0;
        listAnswerSubmit.forEach((answerUser) => {
            // console.log(item);
            // 2.1 tìm câu hỏi có đáp án trong mảng lisQuestion
            const findQuestion = listQuestion.find((ques) => {
                return ques.id == answerUser.idQuestion
            })
            //  ansUser.idAnswers: danh sách đáp của user (mảng)
            // findQuestion.correctAnser: đáp án chính xác lấy từ db (mảng)
            const isChek = this.checkEqual(answerUser.idAnswers, findQuestion.correctAnser)
            // lưu trữ trạng thái đúng sai của câu hỏi
            listStatus.push(
                {
                    idQuestion: findQuestion.id,
                    status: isChek
                }
            );
            if (isChek) {
                // nếu đúng tăng count lên 1
                countRight++;
            }

        })
        console.log(listStatus);
        // hiển thị thông báo đúng hoặc sai của câu hỏi đã trả lời 
        this.renderStatus(listStatus);

        alert(`Bạn đáp án đúng ${countRight} trong ${listQuestion.length} cau hỏi`)
    },
    checkEqual: function (arr1, arr2) {
        // kiểm tra xem 2 mảng có bằng nhau hay không
        //1. kiểm tra độ dài của 2 mảng
        // if( arr1.length != arr2.length)
        //     return false

        // 2. kiểm tra giá trị

        // 2.1 xắp xếp thứ tự 2 mảng tăng hoặc giảm dần
        arr1 = arr1.sort();
        arr2 = arr2.sort();
        // console.log(arr1);
        // console.log(arr2);
        // 2.2 check đáp án
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] != arr2[i]) {
                return false
            }
        }
        return true

    },
    renderStatus: function (listStatus) {
        listStatus.forEach((item) => {
            const title = document.getElementById(item.idQuestion);
            title.innerHTML = `${title.textContent} ${item.status ? `<span class="badge text-bg-success" >đúng</span>` : `<span class="badge text-bg-danger" >sai</span>`}`
        })
    },
    countDown: function (time) {
        
        const that =this;
        function handleTime() {

            // tính toán đổi phút sang giây
            const minute = Math.floor(time / 60);
            // console.log(minute);
            const second = time % 60;

            // console.log(second);
            // 2. lấy id theo phần time
            const timeElement = document.getElementById('timer');
            timeElement.innerHTML = 
            `${minute < 10 ? `0${minute}` : minute}
            :${second < 10 ? `0${second}` : second}
            `
            time--;
            if(isSubmit == true){
                clearInterval(timeInter);
            }
            if (time < 0) {
                clearInterval(timeInter);
                alert("Bạn đã hết thời gian")
                that.handleSubmitForm();
                timeElement.innerHTML = `hết thời gian `
            }



        }
        const timeInter = setInterval(handleTime, 1000);
    },
    reset: function () {
        const btnReset = document.getElementById('btn_reset');
        btnReset.addEventListener('click', () => {
            if(confirm("Bạn có muốn làm lại không?")){
                location.reload();
            }
        })
    },
    start: function () {
        this.getQuizandQuestion();
        this.handleSubmit();
        this.reset();
    }
}

app.start();
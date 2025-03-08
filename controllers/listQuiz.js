import {getAllQuiz} from "../services/api.js";
const app ={
    renderListQuiz: async function(){
        const data = await getAllQuiz();
        console.log(data);
        // duyệt mảng data và hiển thị ra tr
       document.querySelector('tbody').innerHTML = data.map((item,index)=>{
            return `
            <tr>
                <th scope="row">${index+1}</th>
                <td>${item.title}</td>
                <td>${item.isActive ? `<span class="text-success">kích hoạt</span>` : `<span class="text-danger">chưa kích hoạt</span>`} </td>
                <td>${item.time}</td>
                <td>${item.description}</td>
                <td></td>
              </tr>`
        }).join('');
    },
    start: function(){
       this.renderListQuiz()
}

}
app.start();
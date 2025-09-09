// --- Signup ---
document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");
  const questionForm = document.getElementById("questionForm");

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      document.getElementById("signupLoader").style.display = "block";

      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const newUser = {
          name: document.getElementById("signupName").value,
          email: document.getElementById("signupEmail").value,
          pass: document.getElementById("signupPass").value,
          role: document.getElementById("signupRole").value
        };
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        alert("Signup successful! Please login.");
        window.location.href = "login.html";
      }, 2000);
    });
  }

  // --- Login ---
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      document.getElementById("loginLoader").style.display = "block";

      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const email = document.getElementById("loginEmail").value;
        const pass = document.getElementById("loginPass").value;
        const role = document.getElementById("loginRole").value;

        const user = users.find(u => u.email === email && u.pass === pass && u.role === role);
        if (user) {
          localStorage.setItem("currentUser", JSON.stringify(user));
          alert("Login successful!");
          window.location.href = role === "teacher" ? "teacher.html" : "student.html";
        } else {
          alert("Invalid credentials!");
        }
      }, 2000);
    });
  }

  // --- Teacher: Add Questions ---
  if (questionForm) {
    const qList = document.getElementById("questionList");
    const questions = JSON.parse(localStorage.getItem("questions")) || [];
    renderQuestions();

    questionForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const newQ = {
        text: document.getElementById("qText").value,
        options: [
          document.getElementById("opt1").value,
          document.getElementById("opt2").value,
          document.getElementById("opt3").value,
          document.getElementById("opt4").value
        ].filter(o => o),
        correct: document.getElementById("correctOpt").value
      };
      questions.push(newQ);
      localStorage.setItem("questions", JSON.stringify(questions));
      renderQuestions();
      questionForm.reset();
    });

    function renderQuestions() {
      qList.innerHTML = "";
      questions.forEach((q, i) => {
        const li = document.createElement("li");
        li.innerHTML = `${q.text} <button onclick="removeQuestion(${i})">Delete</button>`;
        qList.appendChild(li);
      });
    }

    window.removeQuestion = (i) => {
      questions.splice(i, 1);
      localStorage.setItem("questions", JSON.stringify(questions));
      renderQuestions();
    };
  }

  // --- Student: Load Quiz ---
  const quizForm = document.getElementById("quizForm");
  if (quizForm) {
    const questions = JSON.parse(localStorage.getItem("questions")) || [];
    questions.forEach((q, i) => {
      const div = document.createElement("div");
      div.innerHTML = `<p><b>${i + 1}. ${q.text}</b></p>`;
      q.options.forEach((opt, j) => {
        div.innerHTML += `
          <label>
            <input type="radio" name="q${i}" value="${j + 1}"> ${opt}
          </label><br>
        `;
      });
      quizForm.appendChild(div);
    });
  }
});

// --- Student: Submit Quiz ---
function submitQuiz() {
  const questions = JSON.parse(localStorage.getItem("questions")) || [];
  let score = 0;
  questions.forEach((q, i) => {
    const ans = document.querySelector(`input[name="q${i}"]:checked`);
    if (ans && ans.value == q.correct) score++;
  });
  document.getElementById("result").innerHTML =
    `<h3>Your Score: ${score}/${questions.length}</h3>`;
}

// --- Logout ---
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

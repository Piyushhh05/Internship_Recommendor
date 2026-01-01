let selectedSkills = [];
let selectedInterest = "IT";


document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".skill-card").forEach(card => {
        card.addEventListener("click", () => {
            const skill = card.getAttribute("data-skill");
            const confidenceFill = document.querySelector(".confidence-fill");
            confidenceFill.style.width = Math.min(selectedSkills.length * 15, 100) + "%";   

            if (selectedSkills.includes(skill)) {
                selectedSkills = selectedSkills.filter(s => s !== skill);
                card.classList.remove("active");
            } else {
                selectedSkills.push(skill);
                card.classList.add("active");
            }
        });
    });
});

// function getRecommendations() {

//     let skills = [];
//     document.querySelectorAll('input[type=checkbox]:checked')
//         .forEach(cb => skills.push(cb.value));

//     const data = {
//         education: document.getElementById("education").value,
//         skills: skills,
//         interest: document.getElementById("interest").value,
//         location: document.getElementById("location").value || "Any"
//     };

//     fetch('/recommend', {
//         method: 'POST',
//         headers: {'Content-Type': 'application/json'},
//         body: JSON.stringify(data)
//     })
//     .then(res => res.json())
//     .then(data => {
//         let resultDiv = document.getElementById("results");
//         resultDiv.innerHTML = "";

//         data.forEach(item => {
//             resultDiv.innerHTML += `
//                 <div class="card">
//                     <b>${item.company_name}</b><br>
//                     Role: ${item.role}<br>
//                     Location: ${item.location}<br>
//                     Duration: ${item.duration}<br>
//                     Match Score: ${item.score}
//                 </div>
//             `;
//         });
//     });
// }

// function animateRing(score) {
//     const circle = document.querySelector(".progress-ring-fill");
//     const radius = 52;
//     const circumference = 2 * Math.PI * radius;

//     const offset = circumference - (score * circumference);
//     circle.style.strokeDashoffset = offset;
// }

function animateRing(score) {
    const circle = document.querySelector(".progress-ring-fill");
    const scoreText = document.getElementById("ringScore");

    const radius = 52;
    const circumference = 2 * Math.PI * radius;

    // Clamp score between 0 and 1
    score = Math.max(0, Math.min(score, 1));

    // Animate ring
    const offset = circumference - (score * circumference);
    circle.style.strokeDashoffset = offset;

    // Animate number
    let current = 0;
    const target = Math.round(score * 100);

    const interval = setInterval(() => {
        if (current >= target) {
            clearInterval(interval);
        } else {
            current++;
            scoreText.innerText = current + "%";
        }
    }, 15);
}

function generateAIExplanation(topItem) {
    const text = `
        This internship was recommended because your selected skills and
        interest closely match the role of ${topItem.role} at
        ${topItem.company_name}. The AI compared your profile with
        internship requirements using similarity analysis and found a
        strong alignment.
    `;

    document.getElementById("aiExplainText").innerText = text;
}


document.querySelectorAll(".interest-card").forEach(card => {
    card.addEventListener("click", () => {
        document.querySelectorAll(".interest-card").forEach(c => c.classList.remove("active"));
        card.classList.add("active");
        selectedInterest = card.dataset.interest;
    });
});


function getRecommendations() {
    console.log("Button clicked"); // TEMP DEBUG LINE

    let skills = selectedSkills;
    let interest = selectedInterest;

    const data = {
        education: document.getElementById("education").value,
        skills: skills,
        interest: interest,
        location: document.getElementById("location").value || "Any"
    };

    const resultDiv = document.getElementById("results");
    resultDiv.innerHTML = "<p>Finding best matches...</p>";

    fetch('/recommend', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => {
        console.log("Response received", data);

        resultDiv.innerHTML = "";

        if (!data || data.length === 0) {
            resultDiv.innerHTML = "<p>No internships found</p>";
            return;
        }

        animateRing(data[0].score);
        generateAIExplanation(data[0]);
        window.latestRecommendation = data[0];



        data.forEach((item, index) => {
            setTimeout(() => {
                resultDiv.innerHTML += `
                    <div class="card">
                        <b>${item.company_name}</b>
                        <span class="ai-tip">🧠
                            <span class="tooltip">
                                Matched using AI similarity between your profile and internship.
                            </span>
                        </span><br>
                        Role: ${item.role}<br>
                        Location: ${item.location}<br>
                        Duration: ${item.duration}<br>
                        <small>AI Match Score: ${(item.score * 100).toFixed(1)}%</small>
                    </div>
                `;
            }, index * 150);
        });
    })
    .catch(err => {
        console.error("Fetch error:", err);
        resultDiv.innerHTML = "<p>Error fetching recommendations</p>";
    });
}

function downloadReport() {
    if (!window.latestRecommendation) {
        alert("Please get recommendations first.");
        return;
    }

    const item = window.latestRecommendation;
    const date = new Date().toLocaleString();

    const report = `
AI INTERNSHIP MATCH REPORT
-------------------------

Company: ${item.company_name}
Role: ${item.role}
Location: ${item.location}
Duration: ${item.duration}

AI Match Score: ${(item.score * 100).toFixed(1)}%

Explanation:
This internship was recommended because your profile closely matches
the internship requirements based on skills, education, and interest
similarity using AI-based text matching.

Generated on: ${date}
    `;

    const blob = new Blob([report], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "AI_Internship_Report.txt";
    link.click();
}

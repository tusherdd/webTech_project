let articleData = {
    1: { comments: [], ratings: [], selectedRating: 0 },
    2: { comments: [], ratings: [], selectedRating: 0 }
};

function setupStars(article) {
    document.querySelectorAll(`#starRating${article} span`).forEach(star => {
        star.addEventListener("click", function () {
            let val = parseInt(this.getAttribute("data-val"));
            articleData[article].selectedRating = val;

            document.getElementById(`ratingValue${article}`).innerText =
                "Selected Rating: " + val;

            document.querySelectorAll(`#starRating${article} span`).forEach(s => {
                s.classList.remove("selected");
            });

            for (let i = 0; i < val; i++) {
                document.querySelectorAll(`#starRating${article} span`)[i].classList.add("selected");
            }
        });
    });
}

setupStars(1);
setupStars(2);

document.querySelectorAll(".commentForm").forEach(form => {
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        let id = this.getAttribute("data-id");
        let name = document.getElementById(`name${id}`).value.trim();
        let email = document.getElementById(`email${id}`).value.trim();
        let comment = document.getElementById(`comment${id}`).value.trim();
        let rating = articleData[id].selectedRating;

        let valid = true;

        if (name.length < 2 || name.length > 50) {
            document.getElementById(`nameError${id}`).innerText =
                "Name should be between 2 and 50 characters";
            valid = false;
        } else document.getElementById(`nameError${id}`).innerText = "";

        if (email.length > 0 && !email.includes("@")) {
            document.getElementById(`emailError${id}`).innerText =
                "Please enter a valid email address";
            valid = false;
        } else document.getElementById(`emailError${id}`).innerText = "";

        if (comment.length < 10 || comment.length > 500) {
            document.getElementById(`commentError${id}`).innerText =
                "Comment should between 10 and 500 characters";
            valid = false;
        } else document.getElementById(`commentError${id}`).innerText = "";

        if (!valid) return;

        articleData[id].comments.push({ name, email, comment, rating });

        if (rating > 0) articleData[id].ratings.push(rating);

        updateUI(id);

        form.reset();
        articleData[id].selectedRating = 0;
        document.getElementById(`ratingValue${id}`).innerText = "Selected Rating: 0";
        document.querySelectorAll(`#starRating${id} span`).forEach(s => s.classList.remove("selected"));
    });
});

function updateUI(id) {
    let data = articleData[id];

    document.getElementById(`totalComments${id}`).innerText = data.comments.length;

    let avg = 0;
    if (data.ratings.length > 0) {
        avg = (data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length).toFixed(1);
    }
    document.getElementById(`avgRating${id}`).innerText = avg;

    let list = document.getElementById(`commentList${id}`);
    list.innerHTML = "";

    data.comments.forEach(c => {
        let block = document.createElement("div");
        block.className = "single-comment";
        block.innerHTML = `
            <b>${c.name}</b><br>
            ${c.comment}
            <div class="rating-display">${"★".repeat(c.rating)}</div>
        `;
        list.appendChild(block);
    });
}

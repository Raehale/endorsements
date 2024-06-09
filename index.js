import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, update, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://champions-complements-default-rtdb.firebaseio.com/"
};
const app = initializeApp(appSettings);
const db = getDatabase();
const database = getDatabase(app);
const listsInDB = ref(database);
const complementListInDB = ref(database, "complement");
const fromListInDB = ref(database, "from");
const toListInDB = ref(database, "to");
const likesListInDB = ref(database, "likes");

const endorsementInputEl = document.getElementById("endorsementInput");
const fromInputEl = document.getElementById("fromInput");
const toInputEl = document.getElementById("toInput");
const publishBtn = document.getElementById("publishBtn");
const endorsementListEl = document.getElementById("endorsement");

publishBtn.addEventListener("click", function() {
    let endorsementValue = endorsementInputEl.value;
    let fromValue = fromInputEl.value;
    let toValue = toInputEl.value;    
    let likesValue = 0;
    
    if (!endorsementValue || !fromValue || !toValue) {
        alert("Form Incomplete!");
        return;
    }
    
    push(complementListInDB, endorsementValue);
    push(fromListInDB, fromValue);
    push(toListInDB, toValue);
    push(likesListInDB, likesValue);
});

onValue(listsInDB, function(snapshot) {
    if (snapshot.exists()) {
        let listsArray = Object.entries(snapshot.val());
        let complementsArray = listsArray[0][1];
        let fromsArray = listsArray[1][1];
        let tosArray = listsArray[3][1];
        let heartsArray = listsArray[2][1];
        
        let countArray = Object.entries(listsArray[0][1]);
        endorsementListEl.innerHTML = ``;
        for (let i = 0; i < countArray.length; i++) {
            let complementText = Object.entries(complementsArray)[i];
            let fromText = Object.entries(fromsArray)[i];
            let toText = Object.entries(tosArray)[i];
            let heartText = Object.entries(heartsArray)[i];
                        
            appendEndorsementToEndorsementListEl(complementText, fromText, toText, heartText);
        }
        endorsementListEl.addEventListener("click", function(event) {
            let selectedEl = event.target.id;
            let positionOfSelection = Object.keys(complementsArray).indexOf(selectedEl);
            let likedSection = Object.keys(heartsArray).map((key) => [key, heartsArray[key]])[positionOfSelection];

            incrementLike(selectedEl, likedSection);
        })
    } else {
        endorsementListEl.textContent = "Be the first to compliment!"
    }
});

function appendEndorsementToEndorsementListEl(complementEl, fromEl, toEl, heartEl) {
    let complementKey = complementEl[0];
    let complementValue = complementEl[1];
    let fromValue = fromEl[1];
    let toValue = toEl[1];
    let heartValue = heartEl[1];
    
    endorsementListEl.innerHTML += `<div class="endorsement" id="${complementKey}">
                            <div class="complement-top">
                                <h3 class="to-header" id="${complementKey}">To ${toValue}</h3>
                            </div>
                            <p class="complement-text" id="${complementKey}">${complementValue}</p>
                            <div class="complement-bottom">
                                <h3 class="from-header" id="${complementKey}">From ${fromValue}</h3>
                                <p class="liking" id="${complementKey}"><i class="fa fa-heart"></i><span id="liked${complementKey}">${heartValue}</span></p>
                            </div>
                        </div>`;
                            
}

/**for likes to work, I need to save when someone clicks to firebase */
let countedLikes = Number(0);

function incrementLike(selectedEl, likedSection) {
    
    console.log(selectedEl)
    
    let countedLikeKey = likedSection[0];
    let countedLikeValue = Number(likedSection[1]);

    let selectedLike = document.getElementById(`liked${selectedEl}`);

    countedLikeValue += 1

    const updates = {};
    updates['/likes/' + countedLikeKey] = countedLikeValue;
    
    for (let value in likedSection) {
        countedLikes = likedSection[value] + 1;
        selectedLike.textContent = countedLikes;
    }
    
    return update(ref(db), updates);
    
    // $(document).ready(function () {
    //     $("button").click(function () {
            let $currentSession = $(this);
            if ($this.is(".example-1")) {
                $.cookie("button1", 1, {
                    expires: 1
                });
                $this.prop("disabled", true);
            } else {
                $.cookie("button2", 1, {
                    expires: 1
                });
                $this.hide();
            }
        // });

        if ($.cookie("button1")) {
            $(".example-1").prop("disabled", true);
        }
        if ($.cookie("button2")) {
            $(".example-2").hide();
        }
    // });
    
}
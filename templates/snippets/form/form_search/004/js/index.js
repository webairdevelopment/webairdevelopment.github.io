// Your Skills
const YOUR_SKILLS = ["HTML", "CSS", "JAVASCRIPT"],
	NOT_SKILLS = ["C++", "C#", "PHP"];
// Variables
const SEARCH_INPUT = document.getElementById("skillSearch_Input"),
	SEARCH_BUTTON = document.getElementById("skillSearch_Submit"),
	TRUE_SKILLS = document.getElementById("skillSearch_True"),
	FALSE_SKILLS = document.getElementById("skillSearch_False");
// Click
SEARCH_BUTTON.addEventListener("click", function() {
	let searchInputValue = SEARCH_INPUT.value,
		eachInputValue = searchInputValue.split(/[ ,.]+/),
		wordArray = [],
		yesSkillArray = [],
		notSkillArray = [],
		wordId,
		upperWord,
		upperNotSkills,
		yesSkillId,
		notSkillId,
		yesSkillMap,
		notSkillMap;
	// Loop
	for (wordId = 0; wordId < eachInputValue.length; wordId++) {
		upperWord = eachInputValue[wordId].toUpperCase();
		for (yesSkillId = 0; yesSkillId < YOUR_SKILLS.length; yesSkillId++) {
			upperWord === YOUR_SKILLS[yesSkillId].toUpperCase()
				? yesSkillArray.push(YOUR_SKILLS[yesSkillId].toUpperCase())
				: "";
		}
		for (notSkillId = 0; notSkillId < NOT_SKILLS.length; notSkillId++) {
			upperWord === NOT_SKILLS[notSkillId].toUpperCase()
				? notSkillArray.push(NOT_SKILLS[notSkillId].toUpperCase())
				: "";
		}
	}
	// Rendering
	if (yesSkillArray.length !== 0) {
		TRUE_SKILLS.style.display = "";
		TRUE_SKILLS.innerHTML = `<h2 class="text-success">Yes! I can help with:</h2> <ul>${yesSkillArray
			.map(skill => `<li>${skill}</li>`)
			.join(" ")}</ul>`;
	} else {
		TRUE_SKILLS.style.display = "none";
		TRUE_SKILLS.innerHTML = "";
	}
	if (notSkillArray.length !== 0) {
		FALSE_SKILLS.style.display = "";
		FALSE_SKILLS.innerHTML = `<h2 class="text-danger">Sorry, I cannot help with:</h2> <ul>${notSkillArray
			.map(skill => `<li>${skill}</li>`)
			.join(" ")}</ul>`;
	} else {
		FALSE_SKILLS.style.display = "none";
		FALSE_SKILLS.innerHTML = "";
	}
});
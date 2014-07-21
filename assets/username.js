function generateNoun() {
    var nounArray = [ "Cat", "Dog", "Monkey", "Cow", "Moose", "Chicken",
        "Platypus", "Mango", "Pirate", "Wizard", "Knight", "Box" ];
    var noun = nounArray[Math.floor(Math.random() * nounArray.length)];
    
    return noun;
}

function generateAdj() {
    var adjectiveArray = [ "Blue", "Red", "Metal", "Angry", "Feisty", "Sad",
        "Hungry", "Mellow", "Happy", "Erect", "Aroused", "Deliberate", "Frenzied" ];
    var adj = adjectiveArray[Math.floor(Math.random() * adjectiveArray.length)];

return adj;
}

function generateRandUsername() {
    var adj = generateAdj();
    var noun = generateNoun();
    myUsername = adj + noun;
    return myUsername;
}
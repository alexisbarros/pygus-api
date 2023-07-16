const Syllable = require("./syllable.model");

class Task {
    constructor(data){
        this._id = data._id;
        this.name = data.name;
        this.syllables = (data.syllables ?? [])
            .map(data => new Syllable(data));
        this.phoneme = data.phoneme;
        this.imgUrl = data.imgUrl;
        this.audioUrl = data.audioUrl;
    }
}

module.exports = Task;
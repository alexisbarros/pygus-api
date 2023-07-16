class Syllable {
    constructor(data){
        this._id = data._id;
        this.isPhoneme = data.isPhoneme;
        this.syllable = data.syllable;
        this.audioUrl = data.audioUrl;
    }
}

module.exports = Syllable;
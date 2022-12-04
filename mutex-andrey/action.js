class Action {
  constructor() {
    this.isTryingToOpenSpotify = false;
    this.isTryingToModifyAFile = false;
  }

  openSpotify = async (token) => {
    if (token.active) {
      console.log('WOAH, I opened the Spotify app!');
      this.isTryingToOpenSpotify = false;
    } else {
      this.isTryingToOpenSpotify = true;
    }
  };

  modifyAFile = async (token) => {
    if (token.active) {
      console.log('WOAH, i modified a file!');
      this.isTryingToModifyAFile = false;
    } else {
      this.isTryingToModifyAFile = true;
    }
  };

  performMissedActions = async (token) => {
    if (this.isTryingToOpenSpotify) {
      this.openSpotify(token);
    }
    if (this.isTryingToModifyAFile) {
      this.modifyAFile(token);
    }
  };
}

export default Action;

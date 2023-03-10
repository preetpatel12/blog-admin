class MyUploadAdapter {
    constructor(loader) {
      console.log("jdjfh");
      this.loader = loader;
    }
    // Starts the upload process.
    upload() {
      return this.loader.file.then(
        (file) =>
          new Promise((resolve, reject) => {
            this._initRequest();
            this._initListeners(resolve, reject, file);
            this._sendRequest(file);
          })
      );
    }
  
    // Aborts the upload process.
    abort() {
      if (this.xhr) {
        this.xhr.abort();
      }
    }
  
    // Initializes the XMLHttpRequest object using the URL passed to the constructor.
    _initRequest() {
   
      const xhr = (this.xhr = new XMLHttpRequest());
      xhr.open(
        "POST",
        `https://snowy-cuboid-vulcanodon.glitch.me/api/post/upload`,
        true
      );
      xhr.responseType = "json";
    }
  
    // Initializes XMLHttpRequest listeners.
    _initListeners(resolve, reject, file) {
    
      const { xhr } = this;
      const { loader } = this;
      const genericErrorText = `Couldn't upload file: ${file.name}.`;
  
      xhr.addEventListener("error", () => reject(genericErrorText));
      xhr.addEventListener("abort", () => reject());
      xhr.addEventListener("load", () => {
        const { response } = xhr;
  
        // This example assumes the XHR server's "response" object will come with
        // an "error" which has its own "message" that can be passed to reject()
        // in the upload promise.
        //
        // Your integration may handle upload errors in a different way so make sure
        // it is done properly. The reject() function must be called when the upload fails.
        if (!response || response.error) {
          return reject(
            response && response.error ? response.error.message : genericErrorText
          );
        }

    
        resolve({
          default: response.url
        });
      });
  
      // Upload progress when it is supported. The file loader has the #uploadTotal and #uploaded
      // properties which are used e.g. to display the upload progress bar in the editor
      // user interface.
      if (xhr.upload) {
        xhr.upload.addEventListener("progress", (evt) => {
          if (evt.lengthComputable) {
            loader.uploadTotal = evt.total;
            loader.uploaded = evt.loaded;
          }
        });
      }
    }
  
    // Prepares the data and sends the request.
    _sendRequest(file) {
      // Prepare the form data.
      console.log("dfdkjghd");
      const data = new FormData();
  
      data.append("post", file);
  
      // Important note: This is the right place to implement security mechanisms
      // like authentication and CSRF protection. For instance, you can use
      // XMLHttpRequest.setRequestHeader() to set the request headers containing
      // the CSRF token generated earlier by your application.
  
      // Send the request.
      this.xhr.send(data);
    }
  }
  
  export default MyUploadAdapter;
  
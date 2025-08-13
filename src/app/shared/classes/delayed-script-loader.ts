//https://www.bennadel.com/blog/3613-creating-a-proxy-for-analytics-libraries-in-order-to-defer-loading-and-parsing-overhead-in-angular-7-2-13.htm
export class DelayedScriptLoader {
  private delayInMilliseconds: number;
  private scriptPromise: Promise<void> | null;
  private urls: string[];

  // I initialize the delayed script loader service.
  constructor(urls: string[], delayInMilliseconds: number);
  constructor(urls: string, delayInMilliseconds: number);
  constructor(urls: any, delayInMilliseconds: number) {
    this.delayInMilliseconds = delayInMilliseconds;
    this.scriptPromise = null;
    this.urls = Array.isArray(urls) ? urls : [urls];
  }

  // I load the the underlying Script tags. Returns a Promise.
  public load(): Promise<void> {
    // If we've already configured the script request, just return it. This will
    // naturally queue-up the requests until the script is resolved.
    if (this.scriptPromise) {
      return this.scriptPromise;
    }

    // By using a Promise-based workflow to manage the deferred script loading,
    // requests will naturally QUEUE-UP IN-MEMORY (not a concern) until the delay has
    // passed and the remote-scripts have been loaded. In this case, we're not even
    // going to load the remote-scripts until they are requested FOR THE FIRST TIME.
    // Then, we will use they given delay, after which the in-memory queue will get
    // flushed automatically - Promises rock!!
    this.scriptPromise = this.delay(this.delayInMilliseconds)
      .then(() => {
        var scriptPromises = this.urls.map((url) => {
        return this.loadScript(url);
        });

        return Promise.all(scriptPromises);
      })
      .then(() => {
        // No-op to generate a Promise<void> from the Promise<Any[]>.
      });

    return this.scriptPromise;
  }

  // public loadStyle(): void {
  //     this.loadCSS(this.urls[0]);
  //     // // If we've already configured the script request, just return it. This will
  //     // // naturally queue-up the requests until the script is resolved.
  //     // if (this.scriptPromise) {
  //     //     return (this.scriptPromise);
  //     // }

  //     // By using a Promise-based workflow to manage the deferred script loading,
  //     // requests will naturally QUEUE-UP IN-MEMORY (not a concern) until the delay has
  //     // passed and the remote-scripts have been loaded. In this case, we're not even
  //     // going to load the remote-scripts until they are requested FOR THE FIRST TIME.
  //     // Then, we will use they given delay, after which the in-memory queue will get
  //     // flushed automatically - Promises rock!!
  //     // this.scriptPromise = this.delay(this.delayInMilliseconds).then(() => {
  //     //     var scriptPromises = this.urls.map((url) => {
  //     //         return (this.loadCSS(url));
  //     //     });

  //     //     return (Promise.all(scriptPromises));
  //     // }).then(() => {
  //     //     // No-op to generate a Promise<void> from the Promise<Any[]>.
  //     // });

  //     // return (this.scriptPromise);
  // }

  public addGtag(gtagId: string, adsId: string) {
    this.addGtagCode(gtagId, adsId);
  }

//   public addTagManager(adsId: string) {
//     this.addTagManagerCode(adsId);
//   }

  // I return a Promise that resolves after the given delay.
  private delay(delayInMilliseconds: number): Promise<any> {
    var promise = new Promise((resolve) => {
      setTimeout(resolve, delayInMilliseconds);
    });
    return promise;
  }

  // I inject a Script tag with the given URL into the head. Returns a Promise.
  private loadScript(url: string): Promise<any> {
    var promise = new Promise((resolve, reject) => {
      var commentNode = document.createComment(
        ' Script injected via DelayedScriptLoader. '
      );

      var scriptNode = document.createElement('script');
      scriptNode.type = 'text/javascript';
      scriptNode.onload = resolve;
      scriptNode.onerror = reject;
      scriptNode.src = url;

      document.head.appendChild(commentNode);
      document.head.appendChild(scriptNode);
    });
    return promise;
  }

  // private loadCSS(url: string): void {
  //     var commentNode = document.createComment(" CSS injected via DelayedScriptLoader. ");

  //     var scriptNode = document.createElement("link");
  //     scriptNode.type = "text/css";
  //     scriptNode.rel = "stylesheet";
  //     // scriptNode.onload = resolve;
  //     // scriptNode.onerror = reject;
  //     scriptNode.href = url;

  //     document.head.appendChild(commentNode);
  //     document.head.appendChild(scriptNode);
  // }

  private addGtagCode(gtagId: string, adsId: string) {
    var gtagNode = document.createElement('script');
    gtagNode.type = 'text/javascript';
    gtagNode.text =
        `
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '` + gtagId + `');
            gtag('config', '` + adsId + `');
        `;

    document.head.appendChild(gtagNode);
  }

//   private addTagManagerCode(tagId: string) {
//     var adsNode = document.createElement('script');
//     adsNode.type = 'text/javascript';
//     adsNode.text =
//         `
//             (
//             function (w, d, s, l, i) {
//                 w[l] = w[l] || [];
//                 w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
//                 var f = d.getElementsByTagName(s)[0],
//                     j = d.createElement(s),
//                     dl = l != 'dataLayer' ? '&l=' + l : '';
//                 j.async = true;
//                 j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
//                 f.parentNode.insertBefore(j, f);
//             })
//             (window,document,'script','dataLayer','` + tagId + `');
//         `;
//     document.head.appendChild(adsNode);
//   }
}

// (
//     function (w, d, s, l, i) {
//         w[l] = w[l] || [];
//         w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
//         var f = d.getElementsByTagName(s)[0],
//             j = d.createElement(s),
//             dl = l != 'dataLayer' ? '&l=' + l : '';
//         j.async = true;
//         j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
//         f.parentNode.insertBefore(j, f);
//     }
// );

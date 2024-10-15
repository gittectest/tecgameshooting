        //canvasのサイズを調整するプログラム
        const theCanvas = document.querySelector("#field");
        function canvas_resize() {
            let windowInnerWidth = window.innerWidth;
            let windowInnerHeight = window.innerHeight;
            theCanvas.setAttribute('width', windowInnerWidth - 15);
            theCanvas.setAttribute('height', windowInnerHeight - 100);
        }
        window.addEventListener('resize', canvas_resize, false);
        canvas_resize();//サイズ変更の実行
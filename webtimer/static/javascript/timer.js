document.addEventListener('DOMContentLoaded', function() {
    // DOMが完全にロードされた後に実行される関数
    const audioPlayer = document.getElementById('audioPlayer');　// BGM用のaudio要素を取得
    const sePlayer = document.getElementById('sePlayer');　// SE用のaudio要素を取得
    const progressElement = document.querySelector('.circular-progress');　// 進捗円の要素を取得
    const timerElement = document.getElementById('timer');　// タイマー表示の要素を取得
    const statusElement = document.getElementById('status');　// ステータス表示の要素を取得
    const pauseButton = document.getElementById('pauseButton');　// 一時停止ボタンの要素を取得
    const pauseButtonIcon = document.getElementById('pauseButtonIcon');　// 一時停止ボタンの画像要素を取得
    const progressCircle = document.querySelector('.circular-progress-value');　// 進捗円の値表示部分の要素を取得
    const seOnOffCheckbox = document.getElementById('seOnOff');
    const radius = progressCircle.r.baseVal.value;　// 進捗円の半径を取得
    const circumference = radius * 2 * Math.PI;　// タイマーの合計時間（秒）を取得

    let totalTime = parseInt(progressElement.dataset.time) * 60; // タイマーの合計時間（秒）
    let time = totalTime; // タイマーの現在の残り時間（秒）
    let timerInterval; // タイマーのインターバルIDを保持
    let isPaused = false; // タイマーが一時停止中かどうかを示すフラグ
    let seStarted = false; // SEが開始されたかどうかを示すフラグ
    let seTimeLeft = 2; // SEを鳴らし始めてからの残り時間
    
    progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    progressCircle.style.strokeDashoffset = circumference;
    
    function setProgress(percent) {
        // 進捗円の進捗を設定する関数
        const offset = circumference - percent / 100 * circumference;
        progressCircle.style.strokeDashoffset = offset;
    }
    
    function updateTimer() {
        // タイマーを1秒ごとに更新する関数
        const minutes = Math.floor(time / 60);　// 残り時間の分を計算
        const seconds = time % 60;　// 残り時間の秒を計算
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;　// 分と秒を2桁の文字列に変換し、タイマー表示要素に設定
        
        const progressPercent = ((totalTime - time) / totalTime) * 100;　// 進捗率を計算
        setProgress(progressPercent);　// 進捗率を進捗円に設定
        
        if (time > 0) {
            time--;　// 残り時間を1秒減少
            // 残り2秒になったらSEを鳴らす
            if (time === 2 && !seStarted && seOnOffCheckbox.checked) {
                sePlayer.play();　// SEを再生
                seStarted = true;　// SEが開始されたことを示すフラグを設定
                seTimeLeft = time;　// SEが開始された時の残り時間を設定
            } else if (seStarted) {
                seTimeLeft = time;　// SEが開始されている場合、残り時間を更新
            }
        } else {
            clearInterval(timerInterval); // タイマーが0になったらインターバルをクリア、タイマーを停止
            nextSession(); // 次のセッションに移行
        }
    }

    function startTimer() {
        // タイマーを開始する関数
        timerInterval = setInterval(updateTimer, 1000);　// 1秒ごとにupdateTimer関数を実行
    }

    function pauseTimer() {
        // タイマーを一時停止/再開する関数
        if (isPaused) {
            startTimer();　// 一時停止中ならタイマーを再開
            //pauseButton.textContent = '||';
            pauseButtonIcon.src='../static/images/pause.png';
            statusElement.textContent = '作業中';
            audioPlayer.pause(); // BGMを一時停止
            if (seStarted) {
                sePlayer.play(); // SEを再開（もし鳴っていた場合）
            }
        } else {
            clearInterval(timerInterval); // タイマーを一時停止
            //pauseButton.textContent = '▶'; // 一時停止ボタンの表示を"▶"に変更
            pauseButtonIcon.src='../static/images/start.png';
            statusElement.textContent = '一時停止'; // ステータス表示を"一時停止"に変更
            audioPlayer.play(); // BGMを再開
            sePlayer.pause(); // SEを一時停止
        }
        isPaused = !isPaused; // 一時停止状態を反転
    }

    function nextSession() {
        // 次のセッションに移行する関数
        sePlayer.pause(); // SEを停止
        sePlayer.currentTime = 0; // SEを初期位置に戻す
        seStarted = false; // SEが開始されていない状態にリセット
        fetch('/next_session', {method: 'POST'})
            .then(response => response.json())
            .then(data => {
                if (data.redirect) {
                    window.location.href = data.redirect; // リダイレクト先があればページ遷移
                }
            });
    }

    pauseButton.addEventListener('click', pauseTimer); // pauseButtonがクリックされたときにpauseTimer関数を実行
    startTimer(); // ページロード時にタイマーを開始
});

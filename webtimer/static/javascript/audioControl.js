document.addEventListener('DOMContentLoaded', function() { // DOMが完全にロードされた後に実行される関数
    const audioPlayer = document.getElementById('audioPlayer'); // BGM用のaudio要素を取得
    const bgmSelect = document.getElementById('bgm'); // BGM選択用のセレクトボックスを取得
    const volumeControl = document.getElementById('volume'); // 音量調節用のレンジコントロールを取得
    const pauseButton = document.getElementById('pauseButton'); // タイマーの一時停止ボタンを取得
    const seOnOffCheckbox = document.getElementById('seOnOff');
    let isPaused = false; // タイマーが一時停止中かどうかを示すフラグ
    
    // BGMのソースを定義
    const audioSources = {
        'Barely': '/static/music/Barely.mp3',
        'Colors': '/static/music/Colors.mp3',
        'Epoch': '/static/music/Epoch.mp3',
        'Fairy Lights': '/static/music/Fairy Lights.mp3',
        'Notion': '/static/music/Notion.mp3',
        'Orange': '/static/music/Orange.mp3',
        'Reflection': '/static/music/Reflection.mp3',
        'Room': '/static/music/Room.mp3',
        'Sanctuary': '/static/music/Sanctuary.mp3',
    };

    // 選択されたBGMを更新する関数
    function updateAudioSource() {
        const selectedBGM = bgmSelect.value; // 選択されたBGMの値を取得
        audioPlayer.src = audioSources[selectedBGM]; // audioPlayerのソースを更新
        audioPlayer.play();
        
        if (!isPaused) {
            audioPlayer.play(); // タイマーが動作中の場合、audioPlayerを再生
        }
        
        // BGM変更をサーバーに通知
        fetch('/update_bgm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({bgm: selectedBGM}),
        }).then(response => response.json())
          .then(data => {
            if (data.status === 'success') {
                console.log('BGM updated successfully'); // BGMの更新が成功したことをコンソールに出力
            }
          });
    }

    // 音量を更新する関数
    function updateVolume() {
        audioPlayer.volume = volumeControl.value; // audioPlayerの音量を更新
        
        // 音量変更をサーバーに通知
        fetch('/update_volume', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({volume: volumeControl.value}),
        }).then(response => response.json())
          .then(data => {
            if (data.status === 'success') {
                console.log('Volume updated successfully'); // 音量の更新が成功したことをコンソールに出
            }
          });
    }
    
    // SEの設定を更新する関数
    function updateSESetting() {
        fetch('/update_se_setting', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({seOnOff: seOnOffCheckbox.checked}),
        }).then(response => response.json())
          .then(data => {
            if (data.status === 'success') {
                console.log('SE setting updated successfully');
            }
          });
    }
    
    function pauseTimer() {
        isPaused = !isPaused; // 一時停止状態を反転
    }
    
    // タイマーの一時停止ボタンと連動
    pauseButton.addEventListener('click', function() {
        // pauseButtonがクリックされた時の処理
        if (audioPlayer.paused) {
            audioPlayer.play(); // audioPlayerが一時停止中なら再生
        } else {
            audioPlayer.pause(); // audioPlayerが再生中なら一時停止
        }
    });
    
    // イベントリスナーを設定
    bgmSelect.addEventListener('change', updateAudioSource); // BGM選択が変更された時にupdateAudioSource関数を実行

    volumeControl.addEventListener('input', updateVolume); // 音量が変更された時にupdateVolume関数を実行
    
    // audioSetup.js と audioControl.js の初期化部分
    /*bgmSelect.value = '{{ bgm }}';
    volumeControl.value = '{{ volume }}';*/
    
    pauseButton.addEventListener('click', pauseTimer); // pauseButtonがクリックされたときにpauseTimer関数を実行
    
    seOnOffCheckbox.addEventListener('change', updateSESetting);

    // 初期設定
    updateAudioSource(); // audioSourceを初期設定
    updateVolume(); // 音量を初期設定
});

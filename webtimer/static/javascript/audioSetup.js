document.addEventListener('DOMContentLoaded', function() {
    // オーディオプレイヤー、BGMセレクトボックス、音量コントロール、テストボタンの要素を取得
    const audioPlayer = document.getElementById('audioPlayer');
    const bgmSelect = document.getElementById('bgm');
    const volumeControl = document.getElementById('volume');
    const testButton = document.getElementById('testAudio');
    const testButtonIcon = document.getElementById('testAudioIcon');　// オーディオテストボタンの画像要素を取得
    const timerStartButton = document.getElementById('timerStart')
    const seOnOffCheckbox = document.getElementById('seOnOff');
    
    // BGMのソースを定義
    const audioSources = {
        'なし': '/static/music/muon.mp3',
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
        const selectedBGM = bgmSelect.value; // 選択されたBGMを取得
        audioPlayer.src = audioSources[selectedBGM]; // オーディオプレイヤーのソースを更新
        // BGMが変更されたらボタンをリセット
        resetTestButton();
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
        audioPlayer.volume = volumeControl.value; // オーディオプレイヤーの音量を更新
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
    
    // テストボタンをリセットする関数
    function resetTestButton() {
        audioPlayer.pause(); // オーディオプレイヤーを停止
        audioPlayer.currentTime = 0; // 再生位置をリセット
        //testButton.textContent = '♪'; // ボタンのテキストをリセット
        testButtonIcon.src='../static/images/note.png'; // ボタンの画像を再生用のものへ差し替え
        testButtonIcon.width=19; // ボタンの画像サイズを変更
        testButtonIcon.height=19; // ボタンの画像サイズを変更
    }

    // イベントリスナーを設定
    bgmSelect.addEventListener('change', updateAudioSource); // BGMセレクトボックスに変更があった時のイベントリスナーを設定
    volumeControl.addEventListener('input', updateVolume); // 音量コントロールに変更があった時のイベントリスナーを設定
    
    // テストボタンのイベントリスナー
    testButton.addEventListener('click', function() {
        if (audioPlayer.paused) { // オーディオプレイヤーが停止している場合
            updateAudioSource(); // BGMを更新
            updateVolume(); // 音量を更新
            audioPlayer.play(); // オーディオプレイヤーを再生
            //testButton.textContent = '◼︎'; // ボタンのテキストを更新
            testButtonIcon.src='../static/images/reset.png'; // ボタンの画像を停止用のものへ差し替え
            testButtonIcon.width=16; // ボタンの画像サイズを変更
            testButtonIcon.height=16; // ボタンの画像サイズを変更
        } else { // オーディオプレイヤーが再生中の場合
            resetTestButton(); // テストボタンをリセット
        }
    });
    
    // テストボタンのイベントリスナー
    timerStartButton.addEventListener('click', function() {
        updateAudioSource(); // BGMを更新
        updateVolume(); // 音量を更新
    });
    
    seOnOffCheckbox.addEventListener('change', updateSESetting);
    
    // 初期設定
    updateAudioSource(); // audioSourceを初期設定
    updateVolume(); // 音量を初期設定
});

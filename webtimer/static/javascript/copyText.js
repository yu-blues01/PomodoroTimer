document.addEventListener('DOMContentLoaded', function() {
    const copyButton = document.getElementById('copyButton');
    const shareText = document.getElementById('shareText');

    copyButton.addEventListener('click', function() {
        shareText.select();
        document.execCommand('copy');
        alert('テキストがコピーされました！');
    });
});

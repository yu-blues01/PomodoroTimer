document.addEventListener('DOMContentLoaded', function() {
    const shareText = document.getElementById('shareText').value;
    const encodedText = encodeURIComponent(shareText);
    
    // LINE共有
    document.getElementById('shareLine').addEventListener('click', function() {
        window.open(`https://line.me/R/msg/text/?${encodedText}`);
    });

    // Twitter共有
    document.getElementById('shareTwitter').addEventListener('click', function() {
        window.open(`https://twitter.com/intent/tweet?text=${encodedText}`);
    });

    // Facebook共有
    document.getElementById('shareFacebook').addEventListener('click', function() {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodedText}`);
    });
});

function validateForm() {
    var value1 = document.forms["inputForm"]["value1"].value;
    var value2 = document.forms["inputForm"]["value2"].value;
    var value3 = document.forms["inputForm"]["value3"].value;
    
    if (value1 < 1 || value1 > 50 || isNaN(value1)) {
        alert("1から50までの整数値を入力してください。");
        return false;
    }
    if (value2 < 1 || value2 > 10 || isNaN(value2)) {
        alert("1から10までの整数値を入力してください。");
        return false;
    }
    if (value3 < 1 || value3 > 12 || isNaN(value3)) {
        alert("1から12までの整数値を入力してください。");
        return false;
    }
    return true;
}

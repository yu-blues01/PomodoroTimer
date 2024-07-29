from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from webtimer import app

# ホームページのルートを定義
@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        # フォームからデータを取得し、セッションに保存
        session['work_time'] = int(request.form['work_time'])
        session['break_time'] = int(request.form['break_time'])
        session['circle_time'] = int(request.form['circle_time'])
        session['current_session'] = 1
        session['is_break'] = False
        session['bgm'] = request.form['bgm']
        session['volume'] = float(request.form['volume'])
        session['seOnOff'] = 'seOnOff' in request.form
        return redirect(url_for('timer'))
    # GETリクエストの場合、セッションから値を取得（存在しない場合はデフォルト値を使用）
    work_time = session.get('work_time', 25)
    break_time = session.get('break_time', 5)
    circle_time = session.get('circle_time', 5)
    bgm = session.get('bgm', 'なし')
    volume = session.get('volume', 0.3)
    seOnOff = session.get('seOnOff', False)
    
    return render_template('home.html',
                            work_time=work_time,
                            break_time=break_time,
                            circle_time=circle_time,
                            bgm=bgm,
                            volume=volume,
                            seOnOff=seOnOff)

# タイマーページのルートを定義
@app.route('/timer')
def timer():
    if 'work_time' not in session:
        return redirect(url_for('home'))
    
    # セッション情報を取得
    work_time = session['work_time']
    break_time = session['break_time']
    circle_time = session['circle_time']
    current_session = session['current_session']
    is_break = session['is_break']

    # BGMと音量の情報を追加
    bgm = session.get('bgm', 'なし')
    volume = session.get('volume', 0.3)
    seOnOff = session.get('seOnOff', False)

    # 作業時間か休憩時間かを決定
    time = break_time if is_break else work_time
    
    return render_template('timer.html',
                           time=time,
                           work_time=work_time,
                           break_time=break_time,
                           circle_time=circle_time,
                           current_session=current_session,
                           is_break=is_break,
                           bgm=bgm,
                           volume=volume,
                           seOnOff=seOnOff)
    
# セッション完了ページのルートを定義
@app.route('/complete')
def complete():
    total_work_time = session.get('work_time', 0) * session.get('circle_time', 0)
    return render_template('complete.html', total_work_time=total_work_time)
    
# 次のセッションに進むためのルートを定義
@app.route('/next_session', methods=['POST'])
def next_session():
    if 'work_time' not in session:
        return jsonify({"redirect": url_for('home')})

    # 休憩と作業を切り替える
    session['is_break'] = not session['is_break']
    if not session['is_break']:
        session['current_session'] += 1

    # 全セッションが終了した場合
    if session['current_session'] > session['circle_time']:
        work_time = session.get('work_time', 25)
        break_time = session.get('break_time', 5)
        circle_time = session.get('circle_time', 5)
        bgm = session.get('bgm', 'なし')
        volume = session.get('volume', 0.3)
        seOnOff = session.get('seOnOff', False)
        
        session.clear()
        session['work_time'] = work_time
        session['break_time'] = break_time
        session['circle_time'] = circle_time
        session['current_session'] = 1
        session['is_break'] = False
        session['bgm'] = bgm
        session['volume'] = volume
        session['seOnOff'] = seOnOff
        return jsonify({"redirect": url_for('complete')})

    return jsonify({"redirect": url_for('timer')})

# BGMを更新するためのルートを定義
@app.route('/update_bgm', methods=['POST'])
def update_bgm():
    data = request.json
    session['bgm'] = data['bgm']
    print(session['bgm'])
    return jsonify({"status": "success"})

# 音量を更新するためのルートを定義
@app.route('/update_volume', methods=['POST'])
def update_volume():
    data = request.json
    session['volume'] = float(data['volume'])
    return jsonify({"status": "success"})
    

@app.route('/update_se_setting', methods=['POST'])
def update_se_setting():
    data = request.json
    session['seOnOff'] = data['seOnOff']
    return jsonify({"status": "success"})

# アプリケーションのメインエントリーポイント
if __name__ == '__main__':
    app.run(debug=True)

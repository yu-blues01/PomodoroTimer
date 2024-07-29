# Flaskモジュールをインポートします。
from flask import Flask
from datetime import timedelta
import os

# Flaskアプリケーションのインスタンスを作成し
# __name__はアプリケーションの名前空間をFlaskに伝えるために使用されます。
app = Flask(__name__)
# config.pyから設定の読み込み
app.config.from_object('webtimer.config')

# シークレットキーの設定
app.secret_key = os.environ.get('SECRET_KEY') or 'your_fallback_secret_key_here'

# セッションの有効期限を設定（オプション）
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=60)

# 外部のモジュール（webtimer.views）をインポート
import webtimer.views

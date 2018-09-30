# README

文字オブジェクトの角度を選択中のセグメントに合わせます。文字オブジェクトのみに実行すると傾きをリセットして垂直／水平に戻します。


<div class="fig center" style="margin-bottom: 20px;"><img src="http://www.graphicartsunit.com/saucer/images/fit-angle-text-and-segment/eye.png" alt="イメージ" class="noshadow"></div>


### 更新履歴

* 0.5.0：新規作成（公開）

----

### 対応バージョン

* Illustrator CC 2017／CC 2018（未検証ですがこれ以前のバージョンでも動作する可能性があります）

----

### ダウンロード

* [スクリプトをダウンロードする](https://github.com/gau/fit-text-angle-to-segment/archive/master.zip)

----

### インストール方法

1. ダウンロードしたファイルを解凍します。
2. 所定の場所に「文字の角度をセグメントに合わせる.jsx」をコピーします。Windows版ではお使いのIllustratorの種類によって保存する場所が異なりますのでご注意ください。
3. Illustratorを再起動します。
4. `ファイル > スクリプト > 文字の角度をセグメントに合わせる`と表示されていればインストール成功です。

#### ファイルをコピーする場所

| OS | バージョン | フォルダの場所 |
|:-----|:-----|:-----|
| Mac | 全 | /Applications/Adobe Illustrator *(ver)*/Presets/ja_JP/スクリプト/ |
| 32bit Win | CS5まで | C:\Program Files\Adobe\Adobe Illustrator *(ver)*\Presets\ja_JP\スクリプト\ |
| 64bit Win | CS5, CS6（32bit版） | C:\Program Files (x86)\Adobe\Adobe Illustrator *(ver)*\Presets\ja_JP\スクリプト\ |
| 64bit Win | CS6（64bit版）以降 | C:\Program Files\Adobe\Adobe Illustrator *(ver)* (64 Bit)\Presets\ja_JP\スクリプト\ |

* *(ver)*にはお使いのIllustratorのバージョンが入ります
* 本スクリプトは、CS4以前では動作を検証しておりません

----

### このスクリプトでできること

<div class="fig center"><img src="http://www.graphicartsunit.com/saucer/images/fit-angle-text-and-segment/fig01.png" alt="セグメントと文字オブジェクトの角度を合わせる" class="noshadow"></div>

#### 1. セグメントと文字オブジェクトの角度を合わせる

選択したセグメントの角度を自動で計測し、文字オブジェクトをそれに合わせて回転させます。地図を作成するときなど、文字の角度を道路や線路に合わせるのに便利です。

* セグメントが曲線の場合は両端アンカーポイントを直線で結んだ角度が基準になります


<div class="fig center"><img src="http://www.graphicartsunit.com/saucer/images/fit-angle-text-and-segment/fig02.png" alt="文字オブジェクトの傾きをリセットする" class="noshadow"></div>

#### 2. 文字オブジェクトの傾きをリセットする

傾いた文字オブジェクトの角度をリセットして、垂直／水平に戻します。ポイント文字とエリア内文字、縦書きと横書き、複数の同時処理に対応しています。

----

### スクリプト実行に必要な選択

<div class="fig center"><img src="http://www.graphicartsunit.com/saucer/images/fit-angle-text-and-segment/fig03.png" alt="スクリプト実行に必要な選択" class="noshadow"></div>

選択したセグメントの角度に文字オブジェクトを合わせる場合は、1つのセグメントと文字オブジェクトを同時に選択します。文字オブジェクトの傾きをリセットする場合は、文字オブジェクトのみを選択します。いずれも、文字オブジェクトは複数の同時処理に対応しています。

----

### セグメントの選択方法

<div class="fig center"><img src="http://www.graphicartsunit.com/saucer/images/fit-angle-text-and-segment/fig04.png" alt="セグメントの選択方法" class="noshadow"></div>

［ダイレクト選択ツール］を使って、直線にしたいセグメントのみ、または、セグメント両端のアンカーポイント2点を選択します。これ以外の選択は無効です。適切に選択できていないときは警告を表示します（警告はカスタマイズで非表示にできます）。

----

### 設定をカスタマイズする

スクリプトの5〜７行目にある`followPathDirection`、`keepAnchor`、`showAlert`の値を変更することで、挙動をカスタマイズできます。

| キー | 初期値 | 型 | 内容 |
|:-----|:-----|:-----|:-----|
| followPathDirection | false | boolean | セグメントの方向に従って回転する（`true`セグメントの方向に合わせる｜`false`なるべく文字の向きが上下逆にならないように調整する）|
| keepAnchor | true | boolean | ポイント文字の回転時にアンカーの位置を固定する（`true`固定する｜`false`固定しない）|
| showAlert | true | boolean | オブジェクトやセグメントなどの選択などが適切でない場合に警告を表示する（`true`する｜`false`しない）|

* `keepAnchor`に対応しているのはポイント文字だけです。エリア内文字では挙動は変わりません。

----

### カスタマイズの詳細

#### followPathDirection（初期値：false）

<div class="fig center"><img src="http://www.graphicartsunit.com/saucer/images/fit-angle-text-and-segment/fig05.png" alt="followPathDirection" class="noshadow"></div>

`true`にすると、パスの方向に従って回転の向きを決定します。横書きでは「パスの方向に向かって左」、縦書きでは「パスの方向」が文字の上になります。`false`にすると、なるべく文字の上下が逆にならないように回転を調整します。


#### keepAnchor（初期値：true）

<div class="fig center"><img src="http://www.graphicartsunit.com/saucer/images/fit-angle-text-and-segment/fig06.png" alt="keepAnchor" class="noshadow"></div>

この項目に対応しているのは、ポイント文字だけです。`true`にすると、文字揃えのアンカーの位置が回転の中心になり、結果としてアンカーの位置が固定されます。`false`にすると、文字オブジェクトのバウンディングボックス中央が回転の中心になります。

#### showAlert（初期値：true）

<div class="fig center"><img src="http://www.graphicartsunit.com/saucer/images/fit-angle-text-and-segment/fig07.png" alt="showAlert" class="noshadow"></div>

`true`にすると、有効な選択ができていない場合などに警告を表示し、処理を中断したり実行するかどうかを選択できます。`false`にすると、一切の警告を表示せず、必要に応じて処理を実行、または中止します。

----

### 免責事項

* グループ内のオブジェクトなどにも対応していますが、オブジェクトの構造（特に複雑なグループやマスク、複合パス、複合シェイプなど）によっては、期待する動作をしないこともあります。
* このスクリプトを使って起こったいかなる現象についても制作者は責任を負えません。すべて自己責任にてお使いください。
* Mac版のCC 2017とCC 2018で動作の確認はしましたが、OSのバージョンやその他の状況によって実行できないことがあるかもしれません。もし動かなかったらごめんなさい。

----

### ライセンス

* 文字の角度をセグメントに合わせる.jsx
* Copyright (c) 2018 Toshiyuki Takahashi
* Released under the MIT license
* [http://opensource.org/licenses/mit-license.php](http://opensource.org/licenses/mit-license.php)
* Created by Toshiyuki Takahashi ([Graphic Arts Unit](http://www.graphicartsunit.com/))
* [Twitter](https://twitter.com/gautt)


<?php
// エラー出力する場合
ini_set('display_errors', 1);
//pdoでデータベース接続
try {
    $pdo = new PDO('sqlite:ranking.db');
} catch (PDOException $e) {
    die('DB Error');
}

$rank = 1; //ランキング登録のフラグ

?>
<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/style.css">
    <title>TECSHOOTINGランキングシステム </title>
</head>

<body>
    <div id="box">
        <h1><img src="img/ship.png" class="img_m"> TECSHOOTING Ranking</h1>
    <!--    <span class='current'> ゲームスコアーを前ページから受け取る | name： <?= $_POST['uname']; ?> score： <?= $_POST['score']; ?></span>
        <hr>-->
<?php

        //データを登録
        //「->」アロー演算子は、主にクラスから生成されたインスタンスで、プロパティやメソッドにアクセスする場合に用いられます。
        //exec,SQL文一度の関数コールで SQL 文を実行し、文によって作用した行数を返す。“insert”、”delete”など、SQL 文の実行で完結する場合に使える。
      
    //データがない場合はIDの発行をしない
        if(isset($_POST['uname'])){
            $pdo->exec("INSERT INTO score_t(NAME,RESULT,DATE) VALUES ('{$_POST['uname']}', {$_POST['score']},datetime(CURRENT_TIMESTAMP, 'localtime'))");

            //自分のIDを取得のSQL文（アップデート文で利用するため）
         $sql = "SELECT max(ID) from score_t"; //IDの最大値取得（今登録したのが最大値だから）
         $stm = $pdo->prepare($sql);
         $stm->execute();
         $now_id = $stm->fetch(PDO::FETCH_COLUMN); //指定した1つのカラムだけを1次元配列で取得
        }
      else {
        $now_id=0;
    }
        echo " <table class='table_design09'>
                <thead>
                <tr>
                    <th class='rank'>Rank</th>
                    <th class='score'>Score</th>
                    <th>Name</th>
                    <th>TimeStamp</th>
                </tr>
                </thead>
                <tbody>";
        // 全て表示
        $all = $pdo->query("SELECT * FROM score_t ORDER BY RESULT DESC , DATE ASC");
        while ($row = $all->fetch()) {
            $id = htmlspecialchars($row['ID']);
            $name = htmlspecialchars($row['NAME']);
            $result = htmlspecialchars($row['RESULT']);
            $created_at = htmlspecialchars($row['DATE']);
            if ($row['ID'] == $now_id) {
                echo "<span class='current'>";
            } else {
                echo "<span class=''>";
            }
            if ($id == $now_id) {
                echo "<tr id='current'>"; //色を赤くする
            } else {
                echo "<tr>";
            }
            echo "<th>";
            echo "<!--";
            echo "$id";
            echo "-->";
            if ($rank < 4) {
                echo " <img src='img/crown.png' class='img_s'> ";
            }
            echo "$rank";
            $rank++;
            echo "</th>";
            echo "<th class='score'>";
            echo number_format($result);
            echo "点</th>";
            echo "<th>";
            echo "$name";
            echo "</th>";
            echo "<th>";
            echo "$created_at";
            echo "</th>";
            echo "</tr>";
        }
        ?>
        </tbody>
        </table>
        <div class="right">
        <?php    
        $sql = "SELECT COUNT(*) FROM score_t";
        $all = $pdo->query($sql);

        echo "挑戦数:";
        echo $all->fetchColumn(); //テーブルの行をカウントする

        echo "件 | ";
                echo " <img src='img/crown.png'  class='img_s'> 最終更新日：";
                echo date ('Y-m-d H:i:s');
                // DBを切断
                $pdo = null;
        ?>
        </div>
        <a href="index.html"><button class="Retry">⇦ Retry</button></a>
</body>

</html>
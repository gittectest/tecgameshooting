<?php
// エラー出力する場合
ini_set('display_errors', 1);
//pdoでデータ作成
try {
    $pdo = new PDO('sqlite:ranking.db'); //PDOは「PHP Data Objects」の略で、PHPからデータベースへ簡単にアクセスするための拡張モジュールです。

} catch (PDOException $e) {
    die('DB Error');
}
?>
<!DOCTYPE html>
<html lang="jp">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/style.css">

    <title>ランキングシステム全件表示</title>
</head>

<body>

    <div class="flex">
        <img src="img/crown.png" class="img_s">
        <h1>ランキング一覧ページ</h1>
    </div>

    <?php
    echo "◆全て表示（デバック用）sqlite:ranking.db<hr>";
    // 全て表示
    $all = $pdo->query("SELECT * FROM score_t");
    var_dump($all);
    echo "<hr>";
    while ($row = $all->fetch()) {
        $id = htmlspecialchars($row['ID']);
        $name = htmlspecialchars($row['NAME']);
        $result = htmlspecialchars($row['RESULT']);
        $created_at = htmlspecialchars($row['DATE']);
        echo "ID:";
        echo "$id";
        echo "<br>";
        echo "Name:";
        echo "$name";
        echo "<br>";
        echo "Score:";
        echo "$result";
        echo "<br>";
        echo "TimeStamp:";
        echo "$created_at";
        echo "</span><hr>";
    }

    echo "合計: {$id}件<br>";
    // DBを切断
    $pdo = null;
    ?>
</body>

</html>
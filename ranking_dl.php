<?php
// エラー出力する場合
ini_set('display_errors', 1);
//pdoでデータベース接続
try {
    $pdo = new PDO('sqlite:ranking.db');
} catch (PDOException $e) {
    die('DB Error');
}

$sql = "DELETE FROM score_t "; //データ全件削除
$stm = $pdo->prepare($sql);
$stm->execute();



?>
<!DOCTYPE html>
<html lang="ja">
<body>
削除しました
</body>

</html>
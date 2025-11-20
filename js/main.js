// 1.BGMの仕組み

const bgm = $("#bgm").get(0);

// BGM再生状態に紐づくフラグ、初期状態はオフ（非再生）
// windowオブジェクト採用により、main.js全体で機能する
window.isplaying = false;

$("#button-bgm").on("click", function () {
  if (!isplaying) {
    bgm.play();
    isplaying = true;
  } else {
    bgm.pause();
    isplaying = false;
  }
});

// 2.じゃんけんの仕組み

// 2.(1)
// じゃんけんを設計

$("#rock").on("click", function () {
  var random = Math.floor(Math.random() * 5);

  if (random === 0) {
    $(".a").html("あなた：グー✊　相手：グー✊　<br>結果：引き分け🤝");
  } else if (random === 4) {
    $(".a").html("あなた：グー✊　相手：チョキ✌️　<br>結果：勝ち💪");
    // 「勝ち」の時だけ、クリックした箇所に
    // 「水草の素」<獲得>・<追従>・<使用>イベントを起こす
    itemEvent();
  } else {
    $(".a").html("あなた：グー✊　相手：パー✋　<br>結果：負け🫠");
  }
});

$("#scissors").on("click", function () {
  var random = Math.floor(Math.random() * 10);
  if (random === 0) {
    $(".a").html("あなた：チョキ✌️　相手：チョキ✌️　<br>結果：引き分け🤝");
  } else {
    $(".a").html("あなた：チョキ✌️　相手：グー✊　<br>結果：負け🫠");
  }
});

$("#paper").on("click", function () {
  var random = Math.floor(Math.random() * 3);
  if (random === 0) {
    $(".a").html("あなた：パー✋　相手：パー✋　<br>結果：引き分け🤝");
  } else if (random === 1) {
    $(".a").html("あなた：パー✋　相手：チョキ✌️　<br>結果：負け🫠");
  } else if (random === 2) {
    $(".a").html("あなた：パー✋　相手：グー✊　<br>結果：勝ち💪");
    // 「勝ち」の時だけ、クリックした箇所に
    // 「水草の素」<獲得>・<追従>・<使用>イベントを起こす
    itemEvent();
  }
});

// 2.(2)
// 制限時間を設定

// じゃんけんボタンを一回押したらカウントダウン開始
// 設定している制限時間は60秒
let remaining = 60;
$("#timer").text(" " + remaining + " ");
$(document).one("click", "#rock,#scissors,#paper", function () {
  const intervalId = setInterval(function () {
    remaining -= 1;
    $("#timer").text(" " + remaining + " ");

    if (remaining <= 0) {
      clearInterval(intervalId);
      $(".timekeeper").html("終了です🕛");
      // 制限時間後はじゃんけんボタンが消失
      $("#click-btn button").hide();
    }
    // ゆったりめのカウントダウン
  }, 1150);
});

// 3.「水草の素」<獲得>・<追従>・<使用>イベントの仕組み

//　3.(1)
// 「itemEvent」関数及びグローバル変数を定義

// 「水草の素」使用回数を計測するカウンタ
// 「itemEvent」関数の内側で定義すると、勝つたびにカウントが0になってしまう
let productsCount = 0;
// 「水草の素」獲得状態に紐づくフラグ
// 初期状態はオフ（未獲得）
let $item = false;
// 「水草の素」追従状態に紐づくフラグ
// 初期状態はオフ（非追従）
let isFollowing = false;

// 「勝ち」の時だけ、クリックした箇所に
// 「水草の素」<獲得>・<追従>・<使用>イベントを起こす
function itemEvent() {
  // 3.(2)
  // 「水草の素」使用による生成物を定義

  // 水草の素リスト
  const productsNatureList = ["🌿"];
  // 生き物の素リスト
  const productsFishesList = ["🐠", "🐡", "🐟", "🦀", "🪸", "🪼", "🫧"];

  // 3.(3)
  // クリック時のイベントを定義する関数「クリックハンドラー」を登録

  const clickhandler = function (e) {
    // 3.(3)(A)
    // 「水草の素」未獲得のとき
    // ⭐️⭐️「水草の素」<獲得>イベント⭐️⭐️

    if (!$item) {
      // 「水草の素」を獲得
      $item = $('<div class="getItem"></div>')
        .appendTo("body")
        // 「水草の素」獲得時の「水草の素」配置設定
        // 「水草の素」の中央にカーソルが重なるよう設定
        .css({
          left: e.pageX - 40 + "px",
          top: e.pageY - 40 + "px",
        });
      // ⭐️⭐️「水草の素」<追従>イベント⭐️⭐️
      // 追従フラグをオンにする
      isFollowing = true;
      $(document).on("mousemove.item", function (e) {
        // カーソル追従時の「水草の素」配置設定
        // 円形の左下にgrabbingカーソルが配置されるように設定
        $item.css({
          left: e.pageX - 54 + "px",
          top: e.pageY - 54 + "px",
        });
      });
    }

    // 3.(3)(B)
    // 「水草の素」が追従状態、
    // かつクリック箇所の最も手前側の要素が「main」コンテンツのとき
    // ⭐️⭐️「水草の素」<使用>イベント⭐️⭐️

    // 格納されたDOM関数の数を返すjQueryメソッド「length」を活用
    // クリックした箇所が「main」コンテンツでなければ
    // 「length」は0を返し、この分岐は動作しなくなる
    else if (isFollowing && $(e.target).closest("main").length) {
      // 追従フラグをオフにする
      isFollowing = false;
      // 「水草の素」使用イベントに備えて
      // 「水草の素」使用回数をあらかじめカウント
      productsCount++;
      console.log(productsCount);

      //　3.(3)(B)(a)
      // ローカル変数を定義

      // 「水草の素」を使用することで決定する生成物を入れる箱
      //　初期状態はヌル
      let randomProducts = null;
      // 「水草の素」効果音用の箱
      //　初期状態はオン（中音）
      let babble = $("#babble-middle").get(0);
      // 何が出てくるかランダムで決定
      const randomNature =
        productsNatureList[
          Math.floor(Math.random() * productsNatureList.length)
        ];
      const randomFishes =
        productsFishesList[
          Math.floor(Math.random() * productsFishesList.length)
        ];

      //　3.(3)(B)(b)
      // 「水草の素」を使用した時の生成物を決め、箱に入れる

      // 「水草の素」使用回数が5の倍数以外のとき
      // 水草を生成
      if (productsCount % 5 != 0) {
        randomProducts = randomNature;
      }
      // 「水草の素」使用回数が5の倍数のとき
      // 生き物を生成
      else {
        randomProducts = randomFishes;
      }

      //　3.(3)(B)(c)
      // 「水草の素」を使用し、箱に入った生成物を配置

      $('<div class="useItem">' + randomProducts + "</div>")
        .appendTo("body")
        // 「水草の素」使用時の「水草の素」配置設定
        // 生成物は狙った場所に配置できるよう、カーソルの中央下に設定
        .css({
          left: e.pageX - 40 + "px",
          top: e.pageY - 54 + "px",
        });
      // 「水草の素」を削除
      $item.remove();
      // 「水草の素」獲得状態フラグをオフにする
      $item = false;

      //　3.(3)(B)(d)
      // 「水草の素」効果音箱にBGMを格納
      //　BGMがオンの時だけ、効果音もオンになる仕組み

      if (randomProducts === randomNature && window.isplaying) {
        // 水草生成時は中音を発生させる
        let babble = $("#babble-middle").get(0);
        babble.play();
      } else if (randomProducts === randomFishes && window.isplaying) {
        //　生き物生成時は低い音を発生させる
        let babble = $("#babble-low").get(0);
        babble.play();
      }

      //　3.(3)(B)(e)
      // 誤作動を防ぐため、設定を解除

      // 「水草の素」をクリックした時、
      // 「クリックハンドラー」の登録を解除する
      // 　解除しないと、3.(3)(B)の条件がずっと満たされたままになる
      $(document).off("click.item", clickhandler);

      // 次に、マウス追従をオフにする
      // 解除しないと、ずっとマウスの軌道を発行したままになる
      $(document).off("mousemove.item");
    }
  };

  //　3.(4)
  // itemEvent関数の呼び出しにより「クリックハンドラー」が
  // 登録された後(実質、3.(3)(A)の条件を満たした後)実行する内容を記述

  // 「追従状態になっていない段階でじゃんけん勝利を繰り返すと、
  // 『水草の素』を重複して獲得してしまう」不具合を防ぐため、
  // 一旦、「水草の素」のクリックを全面的に不可とする
  $(document).off("click.item");
  // そして、「クリックハンドラー」が登録された状態でのみ
  // (実質、3.(3)(B)の条件を満たしてる場合のみ)
  // 「水草の素」のクリックを可能にする
  $(document).on("click.item", clickhandler);
}

//　4.制限時間後、人魚たちと会話+じゃんけん再開できる仕組み

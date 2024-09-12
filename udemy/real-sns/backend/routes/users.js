const router = require("express").Router();
const User = require("../models/User");

// router.get("/", (req, res) => {
//   res.send("user router");
// });

//update user
//非同期処理を行うときはasync
//:idは/userの後に、任意のidを入力することができる
router.put("/:id", async (req, res) => {
    //照合
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    // if (req.body.password) {
    //   try {
    //     req.body.password = req.body.password;
    //   } catch (err) {
    //     return res.status(500).json(err);
    //   }
    // }

    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        //$set→すべてのパラメータを更新
        $set: req.body,
      });
      res.status(200).json("ユーザー情報が更新されました");
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("あなたは自分のアカウントの時だけ情報を更新できます。");
  }
});

//delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
        //パラメータのIDさえあれば削除できる
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("account has been deleted");
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("you can delete only your account");
  }
});


//　ユーザー情報の取得
router.get("/:id", async (req, res) => {

  try {

    const user = await User.findById(req.params.id);
    const{password, updatedAt, ...other} = user._doc;
    returnres.status(200).json(other);
   

  }catch(err){
    return res.status(500).json(err);
  }
});

//ユーザーのフォロー
router.put("/:id/follow", async ( req, res) => {
  if(req.body.userId !== req.params.id){
    try{
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if(!user.followers.includes(req.body.userId)){
        //フォロワーに自分がいなかったらフォローができる
        await user.updateOne({
          $push:{
            followers: req.body.userId,
          },
        });
        await currentUser.updateOne({
          $push: {
            followings: req.params.id,
          },
        });
        return res.status(200).json("フォローに成功しました!");
      }else{
        return res.status(403)
        .json("あなたはすでにこのユーザーをフォローしています。");
      }
    }catch(err){
      return res.status(500).json(err);
    }
    } else {
      return res.status(500).json("自分自身をフォローできません。");
    }
  
});


//フォロー解除
router.put("/:id/unfollow", async ( req, res) => {
  if(req.body.userId !== req.params.id){
    try{
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if(user.followers.includes(req.body.userId)){
        //フォロワーに存在したらフォローを外せる
        await user.updateOne({
          $pull:{
            followers: req.body.userId,
          },
        });
        await currentUser.updateOne({
          $push: {
            followings: req.params.id,
          },
        });
        return res.status(200).json("フォロー解除しました!");
      }else{
        return res.status(403)
        .json("このユーザーはフォロー解除できません");
      }
    }catch(err){
      return res.status(500).json(err);
    }
    } else {
      return res.status(500).json("自分自身をフォロー解除できません。");
    }
  
});



module.exports = router;
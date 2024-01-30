const Banner=require('../Model/BannerModel')


const getBanner=async(req,res)=>{
    const bannerData= await Banner.find()
    res.render("banner", {
        title: "bannerpage",
        result:bannerData,
        data: req.admin
    });
}

const addBanner=async(req,res)=>{
    res.render("addBanner", {
        title: "addtrainerpage",
        data: req.admin
    });
}

const postBanner=async(req,res)=>{
    try {
        const Bannerdata = new Banner({
            title: req.body.title,
            subtitle: req.body.subtitle,
            image: req.file.path
        });
        await Bannerdata.save();
        res.redirect("/admin/banner")
    }
    catch (error) {
        console.log(error);
        req.flash("message", "Error!");
        res.redirect("/admin/getaddBanner")
    }
}

const getEditBanner=async(req,res)=>{
    const id = req.params.id
    Banner.findById(id).then((data) => {
        console.log(data);
        res.render('editBanner', {
            title: "editpage",
            responseData: data,
            data: req.admin
        })

    }).catch((err) => {
        console.log(err);
    })
}

const updateBanner=(req,res)=>{
    const id=req.body.banner_id
    Banner.findById(id).then((result) => {
        result.title = req.body.title
        result.subtitle = req.body.subtitle
        if (req.file) {
            result.image = req.file.path;
        }
        return result.save().then(results => {
            res.redirect('/admin/banner')
            console.log(results, "update successfully")
        })
    }).catch(err => {
        console.log(err, "update failed-")
    })
}

const bannerDelete=(req,res)=>{
    Banner.deleteOne({_id:req.params.id}).then((del)=>{
        res.redirect('/admin/banner')
    }).catch((err)=>{
        console.log(err,"delete failed")
    })
}

const bannerActivate=(req,res)=>{
    const id=req.params.id
    Banner.findById(id).then((data)=>{
        data.status='0'
        return data.save().then(result=>{    
            res.redirect('/admin/banner')
            console.log(result,"Banner activate successfully")
        })
    }).catch(err=>{
        console.log(err,"activation failed")
    })
}
const bannerDeactivate=(req,res)=>{
    const id=req.params.id
    Banner.findById(id).then((data)=>{
        data.status='1'
        return data.save().then(result=>{    
            res.redirect('/admin/banner')
            console.log(result,"Banner deactivate successfully")
        })
    }).catch(err=>{
        console.log(err,"activation failed")
    })
}

module.exports={
    getBanner,
    addBanner,
    postBanner,
    getEditBanner,
    updateBanner,
    bannerDelete,
    bannerActivate,
    bannerDeactivate
}
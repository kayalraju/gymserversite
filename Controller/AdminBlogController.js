const Blog=require('../Model/BlogModel')

const getBlog=async(req,res)=>{
    const blogData= await Blog.find()
    res.render("blog", {
        title: "blogpage",
        result:blogData,
        data: req.admin
    });
}

const addBlog=async(req,res)=>{
    res.render("addBlog", {
        title: "addblogpage",
        data: req.admin
    });
}

const postBlog = async (req, res) => {
    try {
        const Blogdata = new Blog({
            title: req.body.title,
            subtitle: req.body.subtitle,
            content: req.body.content,
            image: req.file.path
        });
        await Blogdata.save();
        res.redirect("/admin/blog")
    }
    catch (error) {
        console.log(error);
        req.flash("message", "Error!");
        res.redirect("/admin/getaddTrainer")
    }
}

const getEditBlog=(req,res)=>{
    const id = req.params.id
    Blog.findById(id).then((data) => {
        console.log(data);
        res.render('editBlog', {
            title: "editpage",
            responseData: data,
            data: req.admin
        })

    }).catch((err) => {
        console.log(err);
    })
}

const updateBlog=(req,res)=>{
    const id=req.body.blog_id
    Blog.findById(id).then((result) => {
        result.title = req.body.title
        result.subtitle = req.body.subtitle
        result.content = req.body.content

        if (req.file) {
            result.image = req.file.path;
        }
        return result.save().then(results => {
            res.redirect('/admin/blog')
            console.log(results, "update successfully")
        })
    }).catch(err => {
        console.log(err, "update failed-")
    })
}

const blogDelete=(req,res)=>{
    Blog.deleteOne({_id:req.params.id}).then((del)=>{
        res.redirect('/admin/blog')
    }).catch((err)=>{
        console.log(err,"delete failed")
    })
}

const blogActivate=(req,res)=>{
    const id=req.params.id
    Blog.findById(id).then((data)=>{
        data.status='0'
        return data.save().then(result=>{    
            res.redirect('/admin/blog')
            console.log(result,"Blog activate successfully")
        })
    }).catch(err=>{
        console.log(err,"activation failed")
    })
}
const blogDeactivate=(req,res)=>{
    const id=req.params.id
    Blog.findById(id).then((data)=>{
        data.status='1'
        return data.save().then(result=>{    
            res.redirect('/admin/blog')
            console.log(result,"Blog dectivated successfully")
        })
    }).catch(err=>{
        console.log(err,"activation failed")
    })
}

module.exports={
    getBlog,
    addBlog,
    postBlog,
    getEditBlog,
    updateBlog,
    blogDelete,
    blogActivate,
    blogDeactivate
}
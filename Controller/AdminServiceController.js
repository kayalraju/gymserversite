const Service = require('../Model/ServiceModel')
const Trainer = require('../Model/TrainerModel')

const getServices = async (req, res) => {
    const serviceData = await Service.find().populate("trainerId")
    res.render("services", {
        title: "servicepage",
        result: serviceData,
        data: req.admin
    });
}

const addService = async (req, res) => {
    const result = await Trainer.find()
    res.render("addService", {
        title: "addtrainerpage",
        response: result,
        data: req.admin
    });
}

const postService = async (req, res) => {
    try {
        const Servicedata = new Service({
            trainerId: req.body.trainerId,
            service_name: req.body.service_name,
            service_description: req.body.service_description,
            image: req.file.path
        });
        await Servicedata.save();
        res.redirect("/admin/service")
    }
    catch (error) {
        console.log(error);
        req.flash("message", "Error!");
        res.redirect("/admin/getaddService")
    }
}

// const getEditService=async(req,res)=>{
//     const id = req.params.id
//     Service.findById(id).then((data) => {
//         console.log(data);
//         res.render('editService', {
//             title: "editpage",
//             responseData: data
//         })

//     }).catch((err) => {
//         console.log(err);
//     })
// }

const getEditService = async (req, res) => {
    try {
        const id = req.params.id;

        const serviceData = await Service.findById(id);

        const trainersData = await Trainer.find();

        // console.log(serviceData, trainersData);

        res.render('editService', {
            title: "editpage",
            responseData: {
                service: serviceData,
                trainers: trainersData
            },
            data: req.admin
        });
    } catch (err) {
        console.error(err);
    }
};


// const updateService = (req, res) => {
//     const id = req.body.service_id
//     Service.findById(id).then((result) => {
//         result.trainerId= req.body.trainerId,
//         result.service_name= req.body.service_name,
//         result.service_description= req.body.service_description
//         if (req.file) {
//             result.image = req.file.path;
//         }
//         return result.save().then(results => {
//             res.redirect('/admin/service')
//             console.log(results, "update successfully")
//         })
//     }).catch(err => {
//         console.log(err, "update failed-")
//     })
// }

const updateService = async (req, res) => {
    try {
        const id = req.body.service_id; 

        const service = await Service.findById(id);
        service.trainerId = req.body.trainerId;
        service.service_name = req.body.service_name;
        service.service_description = req.body.service_description;

        if (req.file) {
            service.image = req.file.path;
        }

        const trainer = await Trainer.findById(req.body.trainerId);
        service.trainer_name = trainer.name;

        const updatedService = await service.save();

        // console.log(updatedService, "update successfully");
        res.redirect('/admin/service');
    } catch (err) {
        console.log(err, "update failed-");
    }
};

const serviceDelete=(req,res)=>{
    Service.deleteOne({_id:req.params.id}).then((del)=>{
        res.redirect('/admin/service')
    }).catch((err)=>{
        console.log(err,"delete failed")
    })
}

const serviceActivate=(req,res)=>{
    const id=req.params.id
    Service.findById(id).then((data)=>{
        data.status='0'
        return data.save().then(result=>{    
            res.redirect('/admin/service')
            console.log(result,"Service activated successfully")
        })
    }).catch(err=>{
        console.log(err,"activation failed")
    })
}
const serviceDeactivate=(req,res)=>{
    const id=req.params.id
    Service.findById(id).then((data)=>{
        data.status='1'
        return data.save().then(result=>{    
            res.redirect('/admin/service')
            console.log(result,"Service activated successfully")
        })
    }).catch(err=>{
        console.log(err,"activation failed")
    })
}

module.exports = {
    getServices,
    addService,
    postService,
    getEditService,
    updateService,
    serviceDelete,
    serviceActivate,
    serviceDeactivate
}
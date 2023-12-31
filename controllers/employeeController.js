const  Employee = require('../model/Employee');

const getAllEmployeeData = async (req, res) => {
    const employee = await Employee.find();
    if(!employee) return res.status(204).json({ 'message' : 'No Employee found.'});
    res.json(employee);
} 

const createNewEmployee = async (req, res) => {
    if(!req?.body?.firstname || !req?.body?.lastname){
        return res.status(400).json({'message' : 'Firstname and Lastname are required.'});
    }

    try{
        const result =  await Employee.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname
        });
        res.status(201).json(result);
    }catch(err){
        console.log(err);
    }
 }

const updateEmployee = async (req, res) => {
    if(!req?.body?.id){
        return res.status(400).json({'message' : 'Employee ID  is not found'});
    }

    const employee = await Employee.findOne({_id: req.body.id }).exec();
    if(!employee){
        return res.status(204).json({'message' : `No employee matches ID ${req.body.id}`});
    }

    if(req.body?.firstname) employee.firstname = req.body.firstname;
    if(req.body?.lastname) employee.lastname = req.body.lastname;
    const result = await employee.save();
    res.json(result);
}

const deleteEmployee = async (req, res) => {
    if(!req?.body?.id) return res.status(400).json({'message' : 'Employee ID required.'});
    const employee = await Employee.findOne({_id: req.body.id }).exec();
    if(!employee){
        return res.status(204).json({'message' : `No employee matches ID ${req.body.id}`});
    }
    const result = await employee.deleteOne({ _id: req.body.id});
    res.json(result);
}

const getEmployee = async (req,res) => {
    if(!req?.params?.id) return res.status(400).json({'message' : 'Employee ID required.'});
    const employee = await Employee.findOne({_id: req.params.id }).exec();
    if(!employee){
        return res.status(204).json({'message' : `No employee matches ID ${req.params.id} `});
    }
    res.json(employee);
}

module.exports = {
    getAllEmployeeData,
    createNewEmployee,
    deleteEmployee,
    updateEmployee,
    getEmployee
}
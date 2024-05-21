import { PrismaClient } from '@prisma/client'
import express, {Request,Response} from "express"
const app = express();
//creating a survey endpoint
app.use(express.json())
const prisma = new PrismaClient();
app.post("/survey",async(req:Request,res:Response)=>{
    var body:{
        survey:string,
        question:string,
        options:string[]
    } =  req.body
    // res.json(body)
    const createSurvey=await prisma.survey.findFirst({
        where:{
            survey:body.survey
        }
    })
    if(createSurvey==null){
     try{
        await prisma.survey.create({
            data:{
                survey:body.survey,
            }
           })
     }
     catch(err){
        res.json(err);
     }
    }
   
   var id = await prisma.survey.findMany({
    orderBy:{
        id:"desc"
    },
    
   })
   setTimeout(async() => {
    try{
        await prisma.question.create({
            data:{
                 survey_id:id[0].id,
                question:body.question,
                option:body.options
            }
           
           })
           res.send("Survey successfully created")
    }
    catch(err){
        res.send(err)
    }
   }, 1500);
   
})
//voteview  a survey
app.get("/survey/questionview/:survey_id",async(req:Request,res:Response)=>{
  var survey_id= Number(req.params.survey_id);
  const surveySearch= await prisma.survey.findFirst({
    where:{id:survey_id}
  })
  if(!surveySearch){
    res.send("survey doesnt exist")
  }
  else{
    const data= await prisma.question.findMany({
        where:{survey_id},
        select:{
            id:true,
            question:true,
            option:true
        }
    })
    res.send(JSON.stringify(data));
   

}})
app.post("/survey/vote/:survey_id",async(req:Request,res:Response)=>{
  var survey_id= Number(req.params.survey_id);
  var vote :{
    username:string,
    data:[{
     q_id:number,
     selectedOption:string
    }]
 }=req.body;
 console.log(vote)
     var control=[];
      control= vote.data;
    control.map(async(item:{
        q_id:number,
        selectedOption:string
       })=>{
        var questionData
        try{
             questionData= await prisma.question.findFirst({
                where:{id:item.q_id},
        
            })
            console.log(item.q_id)
            console.log(questionData)
        }
        catch(err){
            console.log("1st"+err)
        }
     
     if(questionData!=null){
        try{
          
             var allocation=await prisma.vote.findFirst({
                where:{question:questionData.question,
                    vote:item.selectedOption

                }
             })
             var arr=[];
              if(allocation!=null)
                {
                    allocation.username.map((item1:any)=>{
                        return arr.push(item1)
                    })
                    arr.push(vote.username)
              try{
                var data= await prisma.vote.update({
                    where:{id:allocation.id},
                        data:{
                            username:arr,
                            voteValue:arr.length
                        }
                })
              }
              catch(err){
                console.log(err)
              }
            
            }
             else{
                try{
                    var store=[];
                    store.push(vote.username)
                    var result1 = await prisma.vote.create({
                        data:{
                            question_id:item.q_id,
                            survey_id,
                            username:store,
                            question:questionData.question,
                            vote:item.selectedOption,
                            voteValue:store.length
                        }
                    })
                   
                }
                catch(err){
                    console.log(err)
                  }
             }
         
            
        }
        catch(err){
            console.log(err)
        }
       
         setTimeout(()=>{
            res.send("done")
         },3000)
     }
    
    })
    
 
 
   }
)
//list of all surveys
app.get('/survey',async(req:Request,res:Response)=>{
    var result=await prisma.question.findMany({
        select:{
            survey:true,
            question:true,
            option:true
        }
    })
    res.send(JSON.stringify(result))

})
//list of a survey by id
app.get('/survey/:survey_id',async(req:Request,res:Response)=>{
    var survey_id=Number(req.params.survey_id)
    var result=await prisma.question.findMany({
        where:{
         survey_id
        },
        select:{
            survey:true,
            question:true,
            option:true
        }
    })
    res.send(JSON.stringify(result))

})
//update a survey by survey_id
app.put("/survey/:survey_id",async(req:Request,res:Response)=>{
    var survey_id=Number(req.params.survey_id)
  var updateData:{
    survey?:string,
    question_id:number
    question?:string,
    options?:string[]
  } = req.body;
  
  try{
    await prisma.survey.update({
        where:{id:survey_id},
        data:{
            survey:updateData.survey
        }
      })
      await prisma.question.update({
        where:{id:updateData.question_id},
        data:{
            question:updateData.question,
            option:updateData.options
        }
      })
      res.send("updated successfully")
  }
  catch(err){
    res.send(JSON.stringify(err))
  }
  
})
//delete a survey by survey_id
app.delete("/survey/:survey_id",async(req:Request,res:Response)=>{
    const survey_id=Number(req.params.survey_id);
    try{
        await prisma.survey.delete({
            where:{id:survey_id},
            select:{
                question:true
            }
        })
       
        res.json('Deleted Successfully')
    }
    catch(err){
        res.json(err)
    }
})
//get result of a survey
//if possible , send a much more strucured result of an survey
app.get("/survey/result/:survey_id",async(req:Request,res:Response)=>{
     var survey_id=Number(req.params.survey_id)
     var result = await prisma.vote.findMany({
        where:{survey_id},
        select:{
            question:true,
            vote:true,
            voteValue:true
        }
     })
     
        res.send(JSON.stringify(result))

     
})
//delete,get result of a survey
app.listen(3000)
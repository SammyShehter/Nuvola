import express from "express"
import CommonMiddleware from "./middlewares/common.middleware"
import {router as postRouter} from "./router/post.router"
import {router as userRouter} from "./router/user.router"
import {router as communityRouter} from "./router/community.router"
import {handle404} from "./utils/common.utils"
import {init, initEvents} from "./utils/init.util"

const app = express()

app.use(express.json())
app.use(CommonMiddleware.saveRequest)
app.use("/post", postRouter)
app.use("/user", userRouter)
app.use("/community", communityRouter)
app.use(handle404)

init()

// ignite
initEvents.once("ready", () => {
    app.listen(process.env.PORT, () => {
        console.log(`Listening on port ${process.env.PORT}`)
        console.log(
            `
                                               
NNNNNNNN        NNNNNNNN                                                        lllllll                   
N:::::::N       N::::::N                                                        l:::::l                   
N::::::::N      N::::::N                                                        l:::::l                   
N:::::::::N     N::::::N                                                        l:::::l                   
N::::::::::N    N::::::Nuuuuuu    uuuuuuvvvvvvv           vvvvvvv ooooooooooo    l::::l   aaaaaaaaaaaaa   
N:::::::::::N   N::::::Nu::::u    u::::u v:::::v         v:::::voo:::::::::::oo  l::::l   a::::::::::::a  
N:::::::N::::N  N::::::Nu::::u    u::::u  v:::::v       v:::::vo:::::::::::::::o l::::l   aaaaaaaaa:::::a 
N::::::N N::::N N::::::Nu::::u    u::::u   v:::::v     v:::::v o:::::ooooo:::::o l::::l            a::::a 
N::::::N  N::::N:::::::Nu::::u    u::::u    v:::::v   v:::::v  o::::o     o::::o l::::l     aaaaaaa:::::a 
N::::::N   N:::::::::::Nu::::u    u::::u     v:::::v v:::::v   o::::o     o::::o l::::l   aa::::::::::::a 
N::::::N    N::::::::::Nu::::u    u::::u      v:::::v:::::v    o::::o     o::::o l::::l  a::::aaaa::::::a 
N::::::N     N:::::::::Nu:::::uuuu:::::u       v:::::::::v     o::::o     o::::o l::::l a::::a    a:::::a 
N::::::N      N::::::::Nu:::::::::::::::uu      v:::::::v      o:::::ooooo:::::ol::::::la::::a    a:::::a 
N::::::N       N:::::::N u:::::::::::::::u       v:::::v       o:::::::::::::::ol::::::la:::::aaaa::::::a 
N::::::N        N::::::N  uu::::::::uu:::u        v:::v         oo:::::::::::oo l::::::l a::::::::::aa:::a
NNNNNNNN         NNNNNNN    uuuuuuuu  uuuu         vvv            ooooooooooo   llllllll  aaaaaaaaaa  aaaa
                                                                       

`
        )
    })
})
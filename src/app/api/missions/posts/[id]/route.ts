import { NextResponse } from "next/server";
import connectMongo from "@/lib/dbConnect";
import MissionModel from "@/models/missionModel";
import UserModel from "@/models/userModel";


export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { content, image, authorId } = await request.json();
  const missionId = params.id;

  await connectMongo();

  try {
    const mission = await MissionModel.findById(missionId);
    if (!mission) {
      return NextResponse.json({ error: "Mission not found" }, { status: 404 });
    }

    const author = await UserModel.findById(authorId);
    if (!author) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 });
    }

    const newPost = {
      author: authorId,
      authorName: author.name,
      authorAvatar: author.avatar,
      content,
      image,
      timestamp: new Date(),
      likes: 0,
      dislikes: 0,
    };

    mission.posts.push(newPost);
    await mission.save();
    //@ts-expect-error ignore
    const postCreated=mission.posts.filter(m=>m.content==newPost.content && m.timestamp==newPost.timestamp);
    console.log('postCreated',postCreated);
    // return NextResponse.json({ post: newPost });
    return NextResponse.json({ post: postCreated[0] });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create post", msg:error }, { status: 500 });
  }
}


// export async function PUT(request: Request, { params }: { params: { id: string } }) {
export async function PUT(request:Request, {params}:{params:{id:string}}){  
// const { postId,userId, content, image } = await request.json();
const { postId } = await request.json();
  const missionId = params.id;
  console.log("params in put req: ",params);
  console.log("postId in put req: ",postId);

  await connectMongo();

  try {
    const mission = await MissionModel.findById(missionId);
    if (!mission) {
      return NextResponse.json({ error: "Mission not found" }, { status: 404 });
    }

    const post = mission.posts.id(postId);
    console.log("post found : ",post);
    if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    console.log(request.headers.get('postLikeFlag'));
    if(request.headers.get('postLikeFlag')=='like'){
        post.likes+=1;
        console.log("liked!!");
    }else if(request.headers.get('postLikeFlag')=='dislike'){
        post.dislikes+=1;
        console.log("disliked!!");
    }

    await mission.save();
    console.log("post found : ",post);
    return NextResponse.json({ updatedPost:post });
    // return NextResponse.json({ error: "Post not found" }, { status: 404 });
  } catch (error) {
      console.error(error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

function detection_body_part(landmarks, body_part_name) {
  return [
    landmarks[mpPose.POSE_LANDMARKS[body_part_name]].x,
    landmarks[mpPose.POSE_LANDMARKS[body_part_name]].y,
    landmarks[mpPose.POSE_LANDMARKS[body_part_name]].visibility,
  ];
}
function norm(arg) {
    return Math.sqrt(Math.pow(arg.x, 2) + Math.pow(arg.y, 2));
  }
function calculate_angle(a, b, c, w) {
  let arg1 = {},
    arg2 = {};
  arg1.y = c[1] - b[1];
  arg1.x = c[0] - b[0];
  arg2.y = a[1] - b[1];
  arg2.x = a[0] - b[0];


  let arg = Math.acos(
    (arg1.x * arg2.x + arg1.y * arg2.y) / (norm(arg1) * norm(arg2))
  );

  if(arg>3){
    console.log("sth wrong");
    console.log()
    return false;
  }

  if ((a[2] + b[2] + c[2]) / 3 < 0.5) {
    console.log("no body");
    return false;
  }
  //   console.log(a[0], b[0]);

  //   try {
  //     radians = arg1 + arg2;
  //   } catch (e) {
  //     console.log(e);
  //   }

    let angle = Math.abs((arg * 180.0) / Math.PI);
    console.error(angle);

  return angle;
}

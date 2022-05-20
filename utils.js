function detection_body_part(landmarks, body_part_name) {
  return [
    landmarks[mpPose.POSE_LANDMARKS[body_part_name]].x,
    landmarks[mpPose.POSE_LANDMARKS[body_part_name]].y,
    landmarks[mpPose.POSE_LANDMARKS[body_part_name]].visibility,
  ];
  
}

function myError(msg, code) {
  let e = new Error(msg);
  e.code = code;
  return e;
}
function calculate_angle(a, b, c) {
  let radians;
  let arg1 = Math.atan2(Math.abs(b[1] - c[1]), Math.abs(c[0] - b[0]));
  let arg2 = Math.atan2(Math.abs(a[1] - b[1]), Math.abs(b[0] - a[0]));

  if ((a[2] + b[2] + c[2]) / 3 < 0.8) {
    throw myError("检测不到相应身体部位", 0);
  }

  if (arg1 < 0 || arg1 > 1.65 || arg2 < 0 || arg2 > 2.1) {
    throw myError("角度不正常，疑似姿势错误", 0);
  }
  radians = arg1 + arg2;

  let angle = 180 - Math.abs((radians * 180.0) / Math.PI);

  return angle;
}

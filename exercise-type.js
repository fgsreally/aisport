//仰卧起坐
let feet_p = 0.8; //脚识别度
let hip_p = 0.8; //胯识别度
let shoulder_p = 0.8; //肩识别度
let wrist_p = 0.7; //手识别度
// let scaleFromHand = 2.5; //肩和臀对于手和肩的比例
let Hangle = 0.2; //竖屏时脚臀角度,20°
let Vangle = 5.6; //横屏时脚臀角度，80°
let leastAngle = 70; //仰卧起坐最小角度
let mostAngle = 120; //最大角度
let distance;

//引体向上
let distfromground = 0.02; //最小离地高度
let distfromrider = 0.1; //手允许的变化范围
let footHeight;
let handHeight;
class BodyPartAngle {
  constructor() {}
  angle_of_the_left_arm() {
    let l_shoulder = detection_body_part(this.landmarks, "LEFT_SHOULDER");
    let l_elbow = detection_body_part(this.landmarks, "LEFT_ELBOW");
    let l_wrist = detection_body_part(this.landmarks, "LEFT_WRIST");
    return calculate_angle(l_shoulder, l_elbow, l_wrist);
  }
  angle_of_the_right_arm() {
    let r_shoulder = detection_body_part(this.landmarks, "RIGHT_SHOULDER");
    let r_elbow = detection_body_part(this.landmarks, "RIGHT_ELBOW");
    let r_wrist = detection_body_part(this.landmarks, "RIGHT_WRIST");
    return calculate_angle(r_shoulder, r_elbow, r_wrist);
  }
  angle_of_the_left_leg() {
    let l_hip = detection_body_part(this.landmarks, "LEFT_HIP");
    let l_knee = detection_body_part(this.landmarks, "LEFT_KNEE");
    let l_ankle = detection_body_part(this.landmarks, "LEFT_ANKLE");
    return calculate_angle(l_hip, l_knee, l_ankle);
  }
  angle_of_the_right_leg() {
    let r_hip = detection_body_part(this.landmarks, "RIGHT_HIP");
    let r_knee = detection_body_part(this.landmarks, "RIGHT_KNEE");
    let r_ankle = detection_body_part(this.landmarks, "RIGHT_ANKLE");
    return calculate_angle(r_hip, r_knee, r_ankle);
  }
  angle_of_the_neck(self) {
    let r_shoulder = detection_body_part(this.landmarks, "RIGHT_SHOULDER");
    let l_shoulder = detection_body_part(this.landmarks, "LEFT_SHOULDER");
    let r_mouth = detection_body_part(this.landmarks, "MOUTH_RIGHT");
    let l_mouth = detection_body_part(this.landmarks, "MOUTH_LEFT");
    let r_hip = detection_body_part(this.landmarks, "RIGHT_HIP");
    let l_hip = detection_body_part(this.landmarks, "LEFT_HIP");

    let shoulder_avg = [
      (r_shoulder[0] + l_shoulder[0]) / 2,
      (r_shoulder[1] + l_shoulder[1]) / 2,
    ];
    let mouth_avg = [
      (r_mouth[0] + l_mouth[0]) / 2,
      (r_mouth[1] + l_mouth[1]) / 2,
    ];
    let hip_avg = [(r_hip[0] + l_hip[0]) / 2, (r_hip[1] + l_hip[1]) / 2];

    return Math.abs(180 - calculate_angle(mouth_avg, shoulder_avg, hip_avg));
  }
  angle_of_the_abdomen() {
    function dist(x, y, str) {
      return Math.sqrt(Math.pow(x[1] - y[1], 2) + Math.pow(x[0] - y[0], 2));
    }
    function testP(Lf, Rf, Lh, Rh, Ls, Rs, Lw, Rw) {
      console.log(Lf, Rf);
      console.log(Lh, Rh); //test
      let angle;

      if (Lw[2] < wrist_p && Rw[2] < wrist_p) {
        distance = true;
      } else {
        if (Lw[2] > wrist_p) {
          distance = dist(Lw, Lh, "手到臀") > dist(Ls, Lh, "肩到臀");
          // console.error(dist(Lw, Lh, "手到臀") / dist(Ls, Lh, "肩到臀"));
        }

        if (Rw[2] > wrist_p) {
          distance = dist(Rw, Rh, "手到臀") > dist(Rs, Rh, "手到臀");
        }
      }
      if (!distance) {
        throw new Error("手应远离腰并放在脖子上");
      }

      if (Lf[2] > feet_p && Lh[2] > hip_p && Ls[2] > shoulder_p && distance) {
        angle = Math.abs(Lf[1] - Lh[1]) / Math.abs(Lf[0] - Lh[0]);
        console.error("leftangle", angle); //test

        if (angle < Hangle || angle > Vangle) {
          return "left";
        }
        throw new Error("检测不到脚或姿势不正确");
      }

      if (Rf[2] > feet_p && Rh[2] > hip_p && Rs[2] > shoulder_p && distance) {
        angle = Math.abs(Rf[1] - Rh[1] / Rf[0] - Rh[0]);
        //  console.error("rightangle", angle);//test
        if (angle < Hangle || angle > Vangle) {
          // console.error(angle, 'anglehv')//test
          return "right";
        }
        throw new Error("检测不到脚或姿势不正确");
      }
      if (Lf[2] < feet_p || Rf[2] < feet_p) {
        throw new Error("检测不到脚");
      }
      if (Lh[2] < hip_p || Rh[2] < hip_p) {
        throw new Error("检测不到腰");
      }
      if (Ls[2] < shoulder_p || Ls[2] < shoulder_p) {
        throw new Error("检测不到肩");
      }

      return false; //所有条件均不符合
    }
   if(!this.landmarks)throw new Error("检测不到任何身体部分")
    let left_foot = detection_body_part(this.landmarks, "LEFT_ANKLE");
    let right_foot = detection_body_part(this.landmarks, "RIGHT_ANKLE");
    let r_shoulder = detection_body_part(this.landmarks, "RIGHT_SHOULDER");
    let l_shoulder = detection_body_part(this.landmarks, "LEFT_SHOULDER");
    let r_hip = detection_body_part(this.landmarks, "RIGHT_HIP");
    let l_hip = detection_body_part(this.landmarks, "LEFT_HIP");
    let l_wrist = detection_body_part(this.landmarks, "LEFT_WRIST");
    let r_wrist = detection_body_part(this.landmarks, "RIGHT_WRIST"); //LEFT_KNEE
    let way = testP(
      left_foot,
      right_foot,
      l_hip,
      r_hip,
      l_shoulder,
      r_shoulder,
      l_wrist,
      r_wrist
    );
    
    if (!way) {
      throw new Error("看不到躯体或其他")
      return false;
    }

    let shoulder_avg = [
      (r_shoulder[0] + l_shoulder[0]) / 2,
      (r_shoulder[1] + l_shoulder[1]) / 2,
      (r_shoulder[2] + l_shoulder[2]) / 2,
    ];

    let hip_avg = [
      (r_hip[0] + l_hip[0]) / 2,
      (r_hip[1] + l_hip[1]) / 2,
      (r_hip[2] + l_hip[2]) / 2,
    ];

    let r_knee = detection_body_part(this.landmarks, "RIGHT_KNEE");
    let l_knee = detection_body_part(this.landmarks, "LEFT_KNEE");
    let knee_avg = [
      (r_knee[0] + l_knee[0]) / 2,
      (r_knee[1] + l_knee[1]) / 2,
      (r_knee[2] + l_knee[2]) / 2,
    ];

    return calculate_angle(shoulder_avg, hip_avg, knee_avg, way);
  }
}
class TypeOfExercise extends BodyPartAngle {
  constructor() {
    super();
  }
  update(landmarks) {
    this.landmarks = landmarks;

    return this;
  }
  push_up(counter, status) {
    let left_arm_angle = this.angle_of_the_left_arm();
    let right_arm_angle = this.angle_of_the_left_arm();
    let avg_arm_angle = left_arm_angle + right_arm_angle;
    if (status) {
      if (avg_arm_angle < 70) {
        counter += 1;
        status = false;
      }
    } else {
      if (avg_arm_angle > 160) {
        counter += 1;
        status = true;
      }
    }
    return {
      counter,
      status,
    };
  }

  pull_up(counter, status) {
    let left_foot = detection_body_part(this.landmarks, "LEFT_FOOT_INDEX");
    let right_foot = detection_body_part(this.landmarks, "RIGHT_FOOT_INDEX");
    let avg_foot_y = (left_foot[1] + right_foot[1]) / 2;
    let avg_foot_p = (left_foot[2] + right_foot[2]) / 2;
    let left_eye = detection_body_part(this.landmarks, "LEFT_EYE");
    let right_eye = detection_body_part(this.landmarks, "RIGHT_EYE");
    let avg_eye_y = (left_eye[1] + right_eye[1]) / 2;
    let avg_eye_p = (left_eye[2] + right_eye[2]) / 2;
    let nose = detection_body_part(this.landmarks, "NOSE");
    let left_wrist = detection_body_part(this.landmarks, "LEFT_WRIST");
    let right_wrist = detection_body_part(this.landmarks, "RIGHT_WRIST");
    let avg_wrist_y = (left_wrist[1] + right_wrist[1]) / 2;
    let avg_wrist_p = (left_wrist[2] + right_wrist[2]) / 2;
    let left_elbow = detection_body_part(this.landmarks, "LEFT_ELBOW");
    let right_elbow = detection_body_part(this.landmarks, "RIGHT_ELBOW");

    let avg_shoulder_y = (left_elbow[1] + right_elbow[1]) / 2;
    let avg_shoulder_p = (left_elbow[2] + right_elbow[2]) / 2;
    if (
      (avg_shoulder_p + avg_eye_p + avg_wrist_p + avg_foot_p + nose[2]) / 5 <
      0.8
    ) {
      console.log("no body");
      return;
    }
    if (!footHeight) {
      footHeight = avg_foot_y;
      console.error(footHeight);
    }
    if (!handHeight) {
      handHeight = avg_wrist_y;
      console.error(handHeight, "init");
    }
    // console.log(avg_shoulder_y, avg_wrist_y);
    // console.log(avg_eye_y, nose[1]);
    console.log(status);
    if (status) {
      if (
        avg_eye_y < avg_wrist_y &&
        avg_wrist_y < avg_shoulder_y &&
        avg_foot_y < footHeight - distfromground &&
        Math.abs(avg_wrist_y - handHeight) < distfromrider
      ) {
        console.error(Math.abs(avg_wrist_y - handHeight), "跳了时手的变化值");
        status = false;
        counter = counter + 1;
        console.log(counter);
        return {
          counter,
          status,
        };
      }
    }
    if (
      nose[1] > avg_shoulder_y &&
      avg_eye_y > avg_wrist_y &&
      Math.abs(avg_wrist_y - handHeight) < distfromrider
    ) {
      status = true;
      footHeight = avg_foot_y;
      handHeight = avg_wrist_y;
      console.error(handHeight, "放松时手位置");
      return {
        counter,
        status,
      };
    }

    // if (status === 0) {
    //     if (avg_eye_y > avg_shoulder_y) {
    //         if (counter === 0) {
    //             footHeight = avg_foot_y
    //         }
    //         status = 1
    //         return
    //     }
    // }

    // if (status === 1) {
    //     if (avg_eye_y > avg_wrist_y) {
    //         if (avg_foot_y > footHeight + 0.1) {
    //             counter = counter + 1
    //         }
    //         status = 2
    //     }
    //     if (avg_eye_y < avg_shoulder_y) {
    //         status = 0
    //     }
    // }

    // if (status === 2) {
    //     if (avg_eye_y < avg_wrist_y) {

    //         status = 1
    //         return
    //     }
    // } else {
    //     if (avg_eye_y < avg_shoulder_y) {
    //         status = 0
    //     }
    //     return
    // }
  }
  squat(counter, status) {
    let left_leg_angle = this.angle_of_the_right_leg();
    let right_leg_angle = this.angle_of_the_left_leg();
    let avg_leg_angle = left_leg_angle + right_leg_angle; // 2

    if (status) {
      if (avg_leg_angle < 70) {
        counter += 1;
        status = false;
      }
    } else {
      if (avg_leg_angle > 160) {
        status = true;
      }
    }

    return {
      counter,
      status,
    };
  }
  walk(counter, status) {
    let right_knee = detection_body_part(this.landmarks, "RIGHT_KNEE");
    let left_knee = detection_body_part(this.landmarks, "LEFT_KNEE");

    if (status) {
      if (left_knee[0] > right_knee[0]) {
        counter += 1;
        status = false;
      }
    } else {
      if (left_knee[0] < right_knee[0]) {
        counter += 1;
        status = true;
      }
    }
    return {
      counter,
      status,
    };
  }
  sit_up(counter, status) {
    let angle = this.angle_of_the_abdomen();

    if (!angle) {
      throw new Error("身体角度不符合规定");
    }

    if (status) {
      if (angle < leastAngle) {
        counter += 1;
        status = false;
      }
    } else {
      if (angle > mostAngle) status = true;
    }
    // console.error(counter, status)

    return {
      counter,
      status,
    };
  }
  calculate_exercise(exercise_type, counter, status) {
    let msg = "";
    try {
      let ret = this[exercise_type](counter, status);
      counter = ret.counter;
      status = ret.status;
    } catch (e) {
      console.log(e, "error");
      msg = e.message;
    }
    return {
      msg,
      counter,
      status,
    };
  }
}
let typeOE = new TypeOfExercise();

function sportAi(landmarks, type, counter, status) {
  let result = typeOE
    .update(landmarks)
    .calculate_exercise(type, counter, status);

  if (!result.counter) {
    result.counter = counter;
    result.status = status;
  }
  //这里返回的result中的msg就是错误信息，即result.msg
  console.log(result);
  return result;
}

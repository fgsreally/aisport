let footHeight = 0;
let wristHeight;
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
    let r_shoulder = detection_body_part(this.landmarks, "RIGHT_SHOULDER");
    let l_shoulder = detection_body_part(this.landmarks, "LEFT_SHOULDER");

    let shoulder_avg = [
      (r_shoulder[0] + l_shoulder[0]) / 2,
      (r_shoulder[1] + l_shoulder[1]) / 2,
      (r_shoulder[2] + l_shoulder[2]) / 2,
    ];

    let r_hip = detection_body_part(this.landmarks, "RIGHT_HIP");
    let l_hip = detection_body_part(this.landmarks, "LEFT_HIP");
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

    return calculate_angle(shoulder_avg, hip_avg, knee_avg);
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
    let left_foot = detection_body_part(this.landmarks, "LEFT_HEEL");
    let right_foot = detection_body_part(this.landmarks, "RIGHT_HEEL");
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
      throw myError("检测不到身体相应部位", 0);
    }
    //下面这种也行
    // if (avg_shoulder_p < 0.8) {
    //   throw myError("检测不到肩", 0);
    // }
    // if (avg_eye_p < 0.8) {
    //   throw myError("检测不到眼睛", 0);
    // }
    // if (avg_wrist_p < 0.8) {
    //   throw myError("检测不到手", 0);
    // }
    // if (avg_foot_p < 0.8) {
    //   throw myError("检测不到脚", 0);
    // }
    // if (nose[2] < 0.8) {
    //   throw myError("检测不到鼻", 0);
    // }
    // if (!footHeight) {
    //   footHeight = avg_foot_y;
    // }
    // if (counter === 1 && avg_foot_y > footHeight - 0) {

    //   //这里判断脚此时和出发点的高度差值，如果调大参数（现为0.01）即更严格，脚要很远离地面，相反则宽松，按需调整
    //   throw myError("脚接触地面，提前结束", 1);
    // }
    if (counter > 1 && Math.abs(wristHeight - avg_wrist_y) > 0.1) {
      //这个参数根据需求改
      throw myError("手发生移动，提前结束", 1);
    }
    if (status) {
      if (avg_eye_y < avg_wrist_y && avg_foot_y < footHeight - 0.07) {
        status = false;
        counter = counter + 1;
        if (counter === 1) {
          wristHeight = avg_wrist_y;
        }
      }
    } else {
      if (nose[1] > avg_shoulder_y && avg_eye_y > avg_wrist_y) {
        status = true;
      }
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

    return {
      counter,
      status,
    };
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
    console.log("角度",angle,Date.now()-startTime);
    if (!angle) {
      return;
    }
    if (status) {
      if (angle < 70) {
        counter += 1;
        status = false;
      }
    } else {
      if (angle > 90) status = true;
    }

    return {
      counter,
      status,
    };
  }
  calculate_exercise(exercise_type, counter, status) {
    if(!this.landmarks){
      return {
        counter,
        status,
      };
    }
    let ret = this[exercise_type](counter, status);
    counter = ret.counter;
    status = ret.status;

    return {
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
  return result;
}

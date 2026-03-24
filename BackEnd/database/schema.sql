CREATE DATABASE IF NOT EXISTS dicehub
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE dicehub;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(120) NOT NULL,
  avatar_url TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS campaigns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  gm_user_id INT NOT NULL,
  name VARCHAR(120) NOT NULL,
  description TEXT NULL,
  system_key VARCHAR(30) NOT NULL DEFAULT '5E_SRD',
  status ENUM('ACTIVE', 'ARCHIVED') NOT NULL DEFAULT 'ACTIVE',
  is_public BOOLEAN NOT NULL DEFAULT 0,
  invite_code VARCHAR(12) NULL UNIQUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_campaigns_gm FOREIGN KEY (gm_user_id) REFERENCES users(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS campaign_members (
  campaign_id INT NOT NULL,
  user_id INT NOT NULL,
  role ENUM('GM', 'PLAYER') NOT NULL,
  status ENUM('PENDING', 'APPROVED', 'REJECTED', 'LEFT') NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  approved_at DATETIME NULL,
  PRIMARY KEY (campaign_id, user_id),
  CONSTRAINT fk_campaign_members_campaign FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_campaign_members_user FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS characters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  campaign_id INT NOT NULL,
  owner_user_id INT NOT NULL,
  name VARCHAR(120) NOT NULL,
  status ENUM('ACTIVE', 'DEAD', 'ABANDONED', 'RETIRED') NOT NULL DEFAULT 'ACTIVE',
  deactivated_at DATETIME NULL,
  sheet_json JSON NOT NULL,
  is_active_flag TINYINT GENERATED ALWAYS AS (
    CASE WHEN status = 'ACTIVE' THEN 1 ELSE NULL END
  ) STORED,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_characters_campaign FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_characters_owner FOREIGN KEY (owner_user_id) REFERENCES users(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT uq_active_character_per_user_campaign UNIQUE (campaign_id, owner_user_id, is_active_flag)
);

CREATE TABLE IF NOT EXISTS character_stat_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  campaign_id INT NOT NULL,
  character_id INT NOT NULL,
  event_type ENUM('DAMAGE_DEALT', 'DAMAGE_TAKEN', 'HEALING_DONE', 'HEALING_RECEIVED') NOT NULL,
  amount INT NOT NULL,
  created_by_user_id INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_stat_events_campaign FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_stat_events_character FOREIGN KEY (character_id) REFERENCES characters(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_stat_events_user FOREIGN KEY (created_by_user_id) REFERENCES users(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS missions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  campaign_id INT NOT NULL,
  title VARCHAR(160) NOT NULL,
  description TEXT NOT NULL,
  objectives_json JSON NOT NULL,
  rewards_json JSON NULL,
  status ENUM('ACTIVE', 'DONE') NOT NULL DEFAULT 'ACTIVE',
  is_visible_to_players BOOLEAN NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_missions_campaign FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS timeline_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  campaign_id INT NOT NULL,
  mission_id INT NULL,
  title VARCHAR(160) NOT NULL,
  description TEXT NOT NULL,
  tags_json JSON NULL,
  occurred_at DATETIME NULL,
  is_visible_to_players BOOLEAN NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_timeline_campaign FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_timeline_mission FOREIGN KEY (mission_id) REFERENCES missions(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS gm_notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  campaign_id INT NOT NULL,
  title VARCHAR(160) NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_gm_notes_campaign FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS dice_rolls (
  id INT AUTO_INCREMENT PRIMARY KEY,
  campaign_id INT NOT NULL,
  user_id INT NOT NULL,
  character_id INT NULL,
  roll_expression VARCHAR(50) NOT NULL,
  result_total INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_dice_rolls_campaign FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_dice_rolls_user FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT fk_dice_rolls_character FOREIGN KEY (character_id) REFERENCES characters(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

CREATE INDEX idx_campaign_members_user ON campaign_members (user_id);
CREATE INDEX idx_characters_campaign_owner ON characters (campaign_id, owner_user_id);
CREATE INDEX idx_stat_events_campaign_character ON character_stat_events (campaign_id, character_id, created_at);
CREATE INDEX idx_missions_campaign ON missions (campaign_id, status);
CREATE INDEX idx_timeline_campaign ON timeline_events (campaign_id, created_at);
CREATE INDEX idx_gm_notes_campaign ON gm_notes (campaign_id, created_at);
CREATE INDEX idx_dice_rolls_campaign_created ON dice_rolls (campaign_id, created_at DESC, id DESC);

DROP TRIGGER IF EXISTS trg_dice_rolls_keep_last_20;

DELIMITER $$

CREATE TRIGGER trg_dice_rolls_keep_last_20
AFTER INSERT ON dice_rolls
FOR EACH ROW
BEGIN
  DELETE dr
  FROM dice_rolls dr
  JOIN (
    SELECT stale.id
    FROM (
      SELECT id
      FROM dice_rolls
      WHERE campaign_id = NEW.campaign_id
      ORDER BY created_at DESC, id DESC
      LIMIT 18446744073709551615 OFFSET 20
    ) AS stale
  ) AS old_rows ON old_rows.id = dr.id;
END$$

DELIMITER ;
